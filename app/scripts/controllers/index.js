'use strict';

angular.module('osApp')
    .controller('IndexCtrl', function($scope, $rootScope, $state, $document, $timeout, $stateParams, $location, $modal, $alert, $translate, Ajax, AuthService, FlashService, Question, Article, Search, File, Classes) {


        $scope.stop = false;
        $scope.lang = $translate.use();
        $scope.scrolling = false;
        $scope.search = '';
        $scope.searchresult = [];
        $scope.connections = [];
        $scope.fbLink = 'https://de-de.facebook.com/OpenScience.or.at';
        $scope.sectionFilter = '';
        $scope.langAlert = "";
        $scope.setArticle = {};
        $scope.goto = function(location, params) {
            $state.go(location, params);
        };
        $scope.gotoSection = function() {
            var loc = "home";
            if ($state.current.name.substring(0, $state.current.name.indexOf('.')) == 'vol') {
                loc = "vol";
            }
            $state.go(loc);
        };
        $scope.setSectionFilter = function(value) {
            if ($scope.sectionFilter === value) {
                $scope.sectionFilter = '';
            } else {
                $scope.sectionFilter = value;
            }
        };
        $scope.setFilterUrl = function(value, location) {
            $scope.sectionFilter = value;
            if ($state.params.categorie !== location) {
                $state.go('section.categorie', {
                    section: $state.params.section,
                    categorie: location
                });
            }
        };
        $scope.resetFilter = function() {
            $scope.sectionFilter = '';
        };
        $scope.updateSearchresult = function(suggestion) {
            if ($scope.search) {
                if ($scope.search.length > 2) {
                    Search.search({
                        query: $scope.search
                    }, function(data) {
                        $scope.searchresult = data.suggestions;
                    });
                } else {
                    $scope.searchresult = [];
                }
            }
        };
        $scope.selectSearch = function(suggestion) {
            if (typeof suggestion == 'object') {
                $state.go('section.categorie.article', {
                    section: suggestion.data.section.name,
                    categorie: suggestion.data.categorie.name,
                    article: suggestion.data.name
                });
            }
        };
        $scope.goSearch = function(suggestion) {
            if (suggestion.length > 2) {
                $state.go('search', {
                    name: suggestion
                });
            }
        };
        $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

            $scope.section = toParams.section;
            $scope.catName = toParams.categorie;

            if (($scope.sectionFilter === 'abgeschlossen' || $scope.sectionFilter === 'laufend') && toParams.categorie !== 'projekte-a-z') {
                $scope.sectionFilter = '';
            }
            $scope.connections = [];
            if (!$scope.section) {
                if (toState.name.indexOf('vol') !== -1) {
                    $scope.section = 'vol';
                    $scope.fbLink = 'https://www.facebook.com/ViennaOpenLab';
                } else {
                    $scope.fbLink = 'https://de-de.facebook.com/OpenScience.or.at';
                }
            }
            if (toParams.section !== fromParams.section) {
                $scope.question = Question.query();
            }

            if (typeof toParams.article !== 'undefined') {
                $timeout(function() {
                    $scope.connections = Article.query({
                        articleId: toParams.article,
                        type: 'connectionsbyname',
                        cat: toParams.categorie,
                        sect: toParams.section,
                        view: 'full'
                    });
                });

                $scope.activeArticle = toParams.article;

            }
            $rootScope.$broadcast('nextConnection',-1);
        });
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.state = $state;
            if (fromState === toState && !$scope.scrolling) {
                if (typeof toParams.article !== 'undefined' && toParams.categorie === fromParams.categorie) {
                    var article = angular.element(document.getElementById(toParams.article));
                    $document.scrollToElement(article, 70);
                    $scope.setArticle = angular.element(article).scope().article;
                }
                if (typeof toParams.name !== 'undefined' && toParams.categorie === fromParams.categorie) {
                    var name = angular.element(document.getElementById(toParams.name));
                    $document.scrollToElement(name, 70);

                }

            }

            $scope.checkLanguage();
            /*
			var el = angular.element(document.getElementById('content_container'));
			var someElement = angular.element(document.getElementById(toParams.article));
			if (typeof toParams.article !== "undefined") {
				$scope.stop = true;
				$document.scrollToElement(someElement, 70, 200).then(function() {
					$scope.stop = false;
					$('.headroom').removeClass('headroom--pinned').addClass('headroom--unpinned');
				});
			} else if (typeof toParams.name !== "undefined") {
				$scope.stop = true;
				$document.scrollToElement(someElement, 70, 200).then(function() {
					$scope.stop = false;
					$('.headroom').removeClass('headroom--pinned').addClass('headroom--unpinned');
				});
			}*/
        });
        $rootScope.activateArticle = function(article) {
            $scope.setArticle = article;
        };

        $scope.checkLanguage = function() {
            if ($state.current.name.indexOf('section') !== -1 && $scope.lang === 'en') {
                if (typeof $scope.langAlert != 'object') {
                    $scope.langAlert = $alert({
                        title: 'This content is not available in English.',
                        content: ' However, an English translation of the <a href="/uns" style="text-decoration:underline">About us</a> and <a href="/vol"  style="text-decoration:underline">Vienna Open Lab</a> section is just waiting to be discovered.',
                        placement: 'bottom',
                        animation: 'am-slide-bottom',
                        type: 'info',
                        show: true
                    });
                } else {
                    //$scope.langAlert.show();
                }
            } else {
                if (typeof $scope.langAlert === 'object') {
                    $scope.langAlert.hide();
                    $scope.langAlert.destroy();
                    $scope.langAlert = "";
                }
            }
        };
        $scope.inThaView = function($index, $inview, $inviewpart, article, kurs, locate) {


            if ($inview && !$rootScope.isLoading) {
                var direct = true;
                var section = 'section';
                var cat = 'categorie';
                var categorie = '';
                var state = '';
                var data = {};
                if (typeof locate !== 'undefined') {
                    if (locate === 'false') {
                        direct = false;
                        $scope.setArticle = article;
                        return;
                    }
                }
                if (typeof kurs !== 'undefined') {
                    if (kurs === 'team') {
                        //console.log($state);
                        if ($state.current.name.indexOf('vol') !== -1) {
                            state = 'voluns.team.person';
                        } else {
                            state = 'uns.wer.person';
                        }
                        data.name = article.name;
                    } else {
                        var destination = {
                            section: 'kurse',
                            name: 'kurs'
                        };
                        switch (article.section.name) {
                            case 'summercamp':
                                destination.section = 'camps';
                                destination.name = 'camp';
                                break;
                            case 'lehrerinnenseminar':
                                destination.section = 'seminare';
                                destination.name = 'seminar';
                                break;
                            case 'kurs':

                                break;
                            default:

                                break;
                        }
                        if (!article.dates) {
                            article.dates = Classes.dates({
                                classId: article.id
                            });
                        }
                        if (!article.files) {
                            article.files = Classes.files({
                                classId: article.id
                            });
                        }
                        state = 'vol.' + destination.section + '.' + destination.name;

                        data[destination.name] = article.name;
                    }
                } else {
                    categorie = article.categorie.name;
                    data = {
                        section: article.section.name,
                        categorie: categorie,
                        article: article.name
                    };
                    if (typeof $state.params.section === 'undefined') {
                        section = $state.current.data.section;
                    }
                    state = section + '.' + cat + '.article';

                }

                if ($inviewpart !== 'bottom') {
                    $scope.setArticle = article;
                    $scope.scrolling = true;
                    if (direct) {
                        $state.transitionTo(state, data, {
                            //notify: false
                        }).then(function() {
                            $scope.scrolling = false;
                        });
                    }

                }

            }
        };
        $scope.downloadFile = function(file) {
            //window.location.assign('http://www.openscience.or.at/' + file.url);
        };
        $scope.downloadZip = function(article, kurs) {
            var data = {};
            if (typeof kurs !== 'undefined') {
                angular.forEach(article, function(file, value) {
                    data[value] = file;
                });
                File.zip({
                    name: kurs.name,
                    files: data
                }, function(data) {
                    window.location.assign('http://www.openscience.or.at/temp/' + data.filename);
                });
            } else {
                angular.forEach(article.files, function(file, value) {
                    data[value] = file;
                });
                File.zip({
                    name: article.name,
                    files: data
                }, function(data) {
                    window.location.assign('http://www.openscience.or.at/temp/' + data.filename);
                });
            }

        };
        $scope.downloadPdf = function(article) {

        };
        $scope.shareOnFacebook = function(article) {

        };
        $scope.sendToEmail = function(article) {
            $scope.mailContent = {};
            $scope.thisArticle = article;
            $scope.mailContent = Ajax.contentToEmail({
                id: article.id
            }, function(data) {

            });
            var mailModal = $modal({
                scope: $scope,
                template: 'views/modal/contentToMail.html',
                show: false
            });
            mailModal.$promise.then(mailModal.show);
        };
        $scope.showNewsletterModal = function() {
            $scope.customer = {};
            $scope.customer.os = true;
            $scope.customer.vol = true;
            var newsletterModal = $modal({
                scope: $scope,
                template: 'views/modal/newsletter.html',
                show: false
            });
            newsletterModal.$promise.then(newsletterModal.show);

        };
        $scope.changeLanguage = function(key) {
            $translate.use(key);
            $scope.lang = key;
            $scope.checkLanguage();
        };
        $scope.setContext = function(article) {
            $scope.article = article;
        };
        $scope.editArticle = function() {
            $scope.article.edit = true;
        };
        $scope.abortArticle = function() {
            $scope.article.edit = false;
            if ($scope.article.id == 0) {
                $scope.articles.splice($scope.articles.indexOf($scope.article), 1);
            }
            $scope.article = {};
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
        $scope.deleteImage = function() {
            delete $scope.article.image;
            $scope.article.image_id = 0;
        };
        $scope.question = Question.query();
    });
