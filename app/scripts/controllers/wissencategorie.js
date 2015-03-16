'use strict';

angular.module('osApp')
    .controller('WissencategorieCtrl', function($scope, $rootScope, $state, $timeout, $document, $location, $modal, Categorie, Article, Person, Partner, FileUploader, FileEdit, AuthService, FlashService, ImageEdit, Glossar, $stateParams) {
        $scope.activeCategorie = '';
        $scope.activeSection = '';
        if ($stateParams.categorie) {
            $scope.activeCategorie = $stateParams.categorie;
        } else {
            if ($state.current.data.categorie) {
                $scope.activeCategorie = $state.current.data.categorie;
            }
        }
        if ($stateParams.section) {
            $scope.activeSection = $stateParams.section;
        } else {
            if ($state.current.data.section) {
                $scope.activeSection = $state.current.data.section;
            }
        }
        $scope.isLoaded = false;
        $scope.article = {};

        $scope.articles = Categorie.get({
            categorieName: $scope.activeSection,
            type: $scope.activeCategorie,
            action: 'articles',
            order: 'position'
        }, function() {
            $scope.isLoaded = true;
            $rootScope.isLoading = true;
            if (typeof $state.params.article !== 'undefined') {
                $timeout(function() {
                    $timeout(function() {
                        var article = angular.element(document.getElementById($state.params.article));
                        $document.scrollToElement(article, 70);
                        $rootScope.isLoading = false;
                        angular.forEach($scope.articles, function(a) {
                            if (a.name == $state.params.article) {
                                $rootScope.activateArticle(a);
                            }
                        });
                    });
                });
            } else {
                $rootScope.isLoading = false;
            }
        });

        // ADMIN PART
        $scope.showQuestion = false;
        $scope.showAutor = false;
        $scope.showShort = false;
        $scope.showPartners = false;
        $scope.authors = [];
        $scope.images = [];
        $scope.image = {};
        $scope.files = [];
        $scope.partners = [];
        $scope.parts = [];
        $scope.doSorting = false;
        $scope.showAllSchachtel = false;
        $scope.allCategories = [];
        $scope.glossar = {};
        $scope.overview = [];
        $scope.sortFilter = '';
        $scope.hasSection = function(sec) {
            var found = false;
            if (typeof $scope.article.sections != "undefined") {
                var sections = $scope.article.sections.split(' ');

                angular.forEach(sections, function(s, key) {
                    if (s == sec.name) {
                        found = true;
                    }
                });
            }
            return found;
        }
        $scope.setSection = function(sec) {
            console.log(sec);
            console.log($scope.article.sections);
            var sections = $scope.article.sections.split(' ');
            var found = false;
            angular.forEach(sections, function(s, key) {
                if (s == sec.name) {
                    delete sections[key];
                    found = true;
                }
            });
            if (!found) {
                sections.push(sec.name);
            }
            $scope.article.sections = sections.join(' ');
            Article.update({
                articleId: $scope.article.id
            }, {
                sections: $scope.article.sections
            }, function(response) {
                if (response.status == false) {
                    FlashService.show('Fehlgeschlagen', '', 'danger');
                } else {
                    $scope.article.edit = false;
                    FlashService.show(response.message, '', 'success');
                }
            });
        };
        $scope.getSelectionText = function() {
            var text = "";
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }
            return text;
        }
        $scope.toggleSorting = function() {
            $scope.doSorting = ($scope.doSorting == false ? true : false);
        };
        $scope.toggleSortFilter = function(sec) {
            if ($scope.sortFilter == sec) {
                $scope.sortFilter = '';
            } else {
                $scope.sortFilter = sec;
            }

        };
        $scope.toggleSchachtel = function() {
            $scope.showAllSchachtel = ($scope.showAllSchachtel == false ? true : false);
        };
        $scope.sortController = {
            orderChanged: function(event) {
                var list = [];
                angular.forEach($scope.articles, function(article) {
                    list.push(article.id);
                });
                Article.sort({
                    list: list
                }, function(response) {
                    if (response.status == false) {
                        FlashService.show('Fehlgeschlagen', '', 'danger');
                    } else {
                        $scope.article.edit = false;
                        FlashService.show(response.message, '', 'success');
                    }
                });
            }
        };
        $scope.savePartners = function() {
            var data = [];
            console.log($scope.article.partners);
            angular.forEach($scope.article.partners, function(partner) {
                data.push(partner.id);
            });
            Article.partners({
                articleId: $scope.article.id
            }, {
                partners: data
            }, function(response) {
                if (response.status == false) {
                    FlashService.show(response.message, '', 'danger');
                } else {
                    $scope.showPartners = false;
                    FlashService.show(response.message, '', 'success');
                }
            })
        };
        $scope.addTag = function() {

        };
        $scope.addGlossar = function() {
            $scope.glossar.word = $scope.textSelection;
            $scope.glossarModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/glossar.html',
                show: false
            });
            $scope.glossarModal.$promise.then($scope.glossarModal.show);

        }
        $scope.saveGlossar = function() {
            $scope.glossar.active = 1;
            Glossar.create($scope.glossar, function(response) {
                if (response.status == false) {
                    FlashService.show('Fehlgeschlagen', '', 'danger');
                } else {
                    $scope.glossarModal.hide();
                    FlashService.show(response.message, '', 'success');
                }
            })
        };
        $scope.openConnectionModal = function() {
            if ($scope.overview.length == 0) {
                $scope.overview = Article.overview();
            }
            $scope.article.connections = Article.connections({
                articleId: $scope.article.name
            });
            $scope.connectionModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/connections.html'
            });
        };
        $scope.toggleConnection = function(article) {
            var isIn = false;
            angular.forEach($scope.article.connections, function(con, key) {
                if (con.id == article.id) {
                    isIn = true;
                    $scope.article.connections.splice(key, 1);
                    Article.removeConnection({
                        articleId: $scope.article.id,
                        data: article.id
                    });
                }
            });
            if (!isIn) {
                $scope.article.connections.push(article);
                Article.addConnection({
                    articleId: $scope.article.id,
                    data: article.id
                }, {});
            }

        };
        $scope.saveAuthor = function() {
            $scope.updateArticleField('person_id', $scope.article.person_id);
            $scope.showAutor = false;
        };
        $scope.toggleActivation = function(active) {
            $scope.article.active = active;
            $scope.updateArticleField('active', active);
        };
        $scope.saveQuestion = function() {
            $scope.updateArticleField('question', $scope.article.question);
            $scope.showQuestion = false;
        };
        $scope.setIntro = function() {
            $scope.article.intro = $scope.textSelection;
            $scope.updateArticleField('intro', $scope.article.intro);
        };
        $scope.updateArticleField = function(field, data) {
            var d = {};
            d[field] = data;
            return Article.update({
                articleId: $scope.article.id
            }, d, function(response) {
                if (response.status == false) {
                    FlashService.show('Fehlgeschlagen', '', 'danger');
                } else {

                    FlashService.show(response.message, '', 'success');
                }
            });
        }
        $scope.setContext = function(article) {
            if (!$scope.article.edit) {
                $scope.article = article;
            }
            $scope.textSelection = $scope.getSelectionText();

        };
        $scope.editArticle = function() {
            $scope.article.edit = true;
            $timeout(function() {
                var articleDOM = angular.element(document.getElementById($scope.article.name));
                $document.scrollToElement(articleDOM, 70, 200);
            });
        };
        $scope.saveArticle = function() {
            if ($scope.article.id) {
                Article.update({
                    articleId: $scope.article.id
                }, $scope.article, function(response) {
                    if (response.status == false) {
                        FlashService.show('Fehlgeschlagen', '', 'danger');
                    } else {
                        $scope.article.edit = false;
                        FlashService.show(response.message, '', 'success');
                    }
                });
            } else {
                Article.create($scope.article, function(response) {
                    if (response.status == false) {
                        FlashService.show('Fehlgeschlagen', '', 'danger');
                    } else {
                        $scope.article.id = response.article.id;
                        FlashService.show(response.message, '', 'success');
                    }
                });
            }
        };
        $scope.abortArticle = function() {
            $scope.article.edit = false;
            if ($scope.article.id == 0) {
                $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
            }
            $scope.article = {};
        };
        $scope.deleteArticle = function() {
            if (confirm('Den Artikel\n' + $scope.article.title + '\nendgültig löschen?')) {
                Article.remove({
                    articleId: $scope.article.id
                }, function(response) {
                    $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
                    $scope.article = {};
                })
            }

        };
        $scope.switchNew = function() {
            if ($scope.article.is_new === 1) {
                $scope.article.is_new = 0;
            } else {
                $scope.article.is_new = 1;
            }
            $scope.saveArticle();
        };
        $scope.froalaOptions = {};
        $scope.getText = function() {
            //console.log($scope.froalaOptions.froala("showMediaManager"));
        };
        $scope.newArticle = function() {
            $scope.article.edit = false;
            $scope.article = {
                id: 0,
                title: 'Neuer Artikel',
                name: 'neuer-artikel',
                text: '',
                image_id: 0,
                parent_id: 0,
                active: 1,
                categorie_id: $scope.articles[0].categorie_id,
                categorie: $scope.articles[0].categorie,
                section: $scope.articles[0].section
            };
            $scope.articles.push($scope.article);
            $scope.editArticle();
        };
        $scope.deleteImage = function() {
            delete $scope.article.image;
            $scope.article.image_id = 0;
        };
        $scope.toggleQuestion = function() {
            $scope.showAutor = false;
            $scope.showShort = false;
            $scope.showPartners = false;
            $scope.showPartners = false;
            $scope.showQuestion = ($scope.showQuestion == false ? true : false);
        };
        $scope.toggleShort = function() {
            $scope.showAutor = false;
            $scope.showQuestion = false;
            $scope.showPartners = false;
            $scope.showPartners = false;
            $scope.showShort = ($scope.showShort == false ? true : false);
        };
        $scope.toggleAutor = function() {
            if ($scope.authors.length == 0 && $scope.isLoading == false) {
                $scope.isLoading = true;
                $scope.authors = Person.query(function() {
                    $scope.isLoading = false;
                });
            }
            $scope.showQuestion = false;
            $scope.showShort = false;
            $scope.showPartners = false;
            $scope.showPartners = false;
            $scope.showAutor = ($scope.showAutor == false ? true : false);
        };
        $scope.togglePartners = function() {
            if ($scope.partners.length == 0 && $scope.isLoading == false) {
                $scope.isLoading = true;
                $scope.partners = Partner.query(function() {
                    $scope.isLoading = false;
                });
            }
            $scope.showQuestion = false;
            $scope.showShort = false;
            $scope.showAutor = false;
            $scope.showPartners = ($scope.showPartners == false ? true : false);
        };
        $scope.setPerson = function() {

            if ($scope.article.person_id != 0 && $scope.article.person_id != '' && $scope.article.person_id != null) {
                angular.forEach($scope.authors, function(person) {
                    if (person.id == $scope.article.person_id) {
                        $scope.article.person = person;
                    }
                });
            } else {
                $scope.article.person_id = 0;
                delete $scope.article.person;
            }
        };
        $scope.cropImage = function() {
            $scope.showAutor = false;
            $scope.showShort = false;
            $scope.showQuestion = false;
            $scope.showPartners = false;
            $scope.cropModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/cropImage.html',
                show: false
            });
            $scope.cropModal.$promise.then($scope.cropModal.show);
        };
        $scope.hideCropping = function() {
            $scope.cropModal.hide();
            $('.imgareaselect-selection').parent().remove();
            $('.imgareaselect-outer').remove();
        };
        $scope.setCrop = function(img, selection) {
            $scope.article.image.thumb_coords = JSON.stringify(selection);
            //console.log($scope.article.image);
        };
        $scope.editImages = function() {
            $scope.showAutor = false;
            $scope.showShort = false;
            $scope.showQuestion = false;
            $scope.showPartners = false;
            var imagesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/images.html',
                show: false
            });
            imagesModal.$promise.then(imagesModal.show);
        };

        $scope.openImagesModal = function(multiple) {
            uploader.clearQueue();
            $scope.images = [];
            $scope.image = {};
            $scope.uploadMultiple = multiple;
            if (!multiple) {
                uploader.queueLimit = 1;
                $scope.image.id = 0;
            } else {
                uploader.queueLimit = 20;
            }
            $scope.uploadImagesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/uploadImages.html',
                show: false
            });
            $scope.uploadImagesModal.$promise.then($scope.uploadImagesModal.show);
        };
        $scope.addImages = function(isValid) {
            if ($scope.uploadMultiple) {
                if ($scope.article.images == null) {
                    $scope.article.images = [];
                }
                angular.forEach($scope.images, function(image) {
                    Article.addImage({
                        image_id: image.id,
                        article_id: $scope.article.id
                    }, function() {
                        $scope.article.images.push(image);
                    });

                });
                $scope.images = [];
            } else {
                $scope.article.image = $scope.image;
                $scope.article.image_id = $scope.image.id;
                $scope.image = {};
            }
            $scope.uploadImagesModal.hide();
        };
        $scope.removeImage = function(image) {
            Article.removeImage({
                articleId: $scope.article.id,
                data: image.id
            }, function(response) {
                if (response.status == true) {
                    $scope.article.images.splice($scope.article.images.indexOf(image), 1);
                }
            });
        };
        $scope.saveImageData = function(isValid) {
            if (isValid) {
                ImageEdit.update({
                    imageId: $scope.article.image.id
                }, {
                    title: $scope.article.image.title,
                    thumb_coords: $scope.article.image.thumb_coords,
                    source: $scope.article.image.source
                }, function(response) {
                    if (response.status == true) {
                        $scope.hideCropping();
                    }
                });
            }
        };
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://www.openscience.or.at/assets/ajax/uploadImages.php',
            alias: 'qqfile',
            queueLimit: 20
        });
        uploader.formData = [{
            cat: 'articles',
            id: 'new'
        }];
        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            uploader.formData[0].id = $scope.article.id;
            fileItem.formData[0].id = $scope.article.id;

        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if ($scope.uploadMultiple) {
                $scope.images.push(response.image);
            } else {
                $scope.image = response.image;
            }

        };


        $scope.editFiles = function() {
            $scope.showAutor = false;
            $scope.showShort = false;
            $scope.showQuestion = false;
            $scope.showPartners = false;
            var filesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/files.html',
                show: false
            });
            filesModal.$promise.then(filesModal.show);
        };
        $scope.openFilesModal = function() {
            uploaderFiles.clearQueue();
            $scope.files = [];
            $scope.uploadFilesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/uploadFiles.html',
                show: false
            });
            $scope.uploadFilesModal.$promise.then($scope.uploadFilesModal.show);
        };
        $scope.addFiles = function(isValid) {

            if ($scope.article.files == null) {
                $scope.article.files = [];
            }
            angular.forEach($scope.files, function(file) {
                Article.addFile({
                    file_id: file.id,
                    article_id: $scope.article.id
                }, function() {
                    $scope.article.files.push(file);
                });

            });
            $scope.files = [];
            $scope.uploadFilesModal.hide();
        };
        $scope.removeFile = function(file) {
            Article.removeFile({
                articleId: $scope.article.id,
                data: file.id
            }, function(response) {
                if (response.status == true) {
                    $scope.article.files.splice($scope.article.files.indexOf(file), 1);
                }
            });
        };
        $scope.updateFileName = function(file, data) {
            FileEdit.update({
                fileId: file.id
            }, {
                name: data
            }, function(response) {

            });
        };
        var uploaderFiles = $scope.uploaderFiles = new FileUploader({
            url: 'http://www.openscience.or.at/assets/ajax/uploadFiles.php',
            alias: 'qqfile',
        });
        uploaderFiles.formData = [{
            cat: 'articles',
            id: 'new'
        }];

        // CALLBACKS
        uploaderFiles.onAfterAddingFile = function(fileItem) {
            uploaderFiles.formData[0].id = $scope.article.id;
            fileItem.formData[0].id = $scope.article.id;
        };
        uploaderFiles.onSuccessItem = function(fileItem, response, status, headers) {
            $scope.files.push(response.file);
        };

    });