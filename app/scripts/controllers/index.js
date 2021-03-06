'use strict';

angular.module('osApp')
    .controller('IndexCtrl', function($scope, $rootScope, $state, $document, $timeout, $stateParams, $location, $modal, $alert, $translate, AuthService, FlashService, Question, Article, Search, File, Classes, Email, Newsletter) {
        $rootScope.opened = false;

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
        $scope.goBack = function() {

            if ($rootScope.fromState) {
                if ($rootScope.fromState.url != "^") {
                    $state.go($rootScope.fromState.name, $rootScope.fromParams);
                } else {
                    $state.go('home');
                }
            } else {
                $state.go('home');
            }

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
            $rootScope.$broadcast('nextConnection', -1);
        });
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.menuOpened = false;
            if (fromState.url.indexOf('/admin') == -1) {
                $rootScope.fromState = fromState;
                $rootScope.fromParams = fromParams;
            }
            $scope.state = $state;
            if (fromState === toState && !$scope.scrolling) {
                if (typeof toParams.article !== 'undefined' && toParams.categorie === fromParams.categorie) {
                    var article = angular.element(document.getElementById(toParams.article));
                    $document.scrollToElement(article, 70);
                    //$scope.setArticle = angular.element(article).scope().article;
                    $rootScope.activateArticle(angular.element(article).scope().article);
                }
                if (typeof toParams.name !== 'undefined' && toParams.categorie === fromParams.categorie) {
                    var name = angular.element(document.getElementById(toParams.name));
                    $document.scrollToElement(name, 70);

                }

            }

            $scope.checkLanguage();
        });
        $rootScope.activateArticle = function(article) {
            $scope.setArticle = article;
            $rootScope.article = article;
            $rootScope.$emit('readyToGo', article);
        };
        $scope.checkLanguage = function() {

            if (($state.current.name.indexOf('section') !== -1 || $state.current.name == 'home') && $scope.lang === 'en') {
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
                        $rootScope.activateArticle(article)
                        //$scope.setArticle = article;
                        return;
                    }
                }
                if (typeof kurs !== 'undefined') {

                    if (kurs === 'team') {
                        //console.log($state);
                        if ($state.current.name.indexOf('vol') !== -1) {
                            if ($state.current.name.indexOf('elab') !== -1) {
                              state = 'volelab';
                            }
                            else{
                              state = 'voluns.team.person';
                            }
                            //
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
                        if(kurs == "kalender"){
                          direct = false;
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
                    //$scope.setArticle = article;
                    $scope.scrolling = true;
                    //$rootScope.article = article;
                    $rootScope.activateArticle(article)
                    if (direct) {
                        $state.transitionTo(state, data, {
                            //notify: false
                        }).then(function() {
                            $scope.scrolling = false;
                              $rootScope.activateArticle(article)

                        });
                    }

                }
                console.log(state);
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
        /*$scope.downloadPdf = function(article) {
          $scope.downloadPDFname = "";
            Email.getPdf({
              id:article.id
            },function(data){
              $scope.downloadPDFname = data.filename;
            });
        };*/
        $scope.sendToEmail = function(article) {
            $scope.messenger = {};
            $scope.thisArticle = article;
            $scope.mailModal = $modal({
                scope: $scope,
                template: 'views/modal/contentToMail.html',
                show: false
            });
            $scope.mailModal.$promise.then($scope.mailModal.show);
        };
        $scope.sendArticleToMail = function(form, valid){
          $scope.doLoad = true;
          Email.sendArticle({id:$scope.thisArticle.id},{
            from_name:$scope.messenger.name,
            from_mail:$scope.messenger.email,
            to_mail: $scope.messenger.receiver_email,
            from_text:$scope.messenger.text
          }, function(data){
              $scope.doLoad = false;
              if(data.success == true){
                $scope.mailModal.hide();
                FlashService.show('Die Email wurde erfolgreich an '+$scope.messenger.receiver_email+' gesendet!','', 'success');

              }else {
                FlashService.show('Leider ist ein Fehler beim versenden des Artikels aufgetreten!','', 'danger');
              }
        });
        };
        $scope.showNewsletterModal = function() {
            $scope.newsletter = {};
            $scope.newsletter.os = true;
            $scope.newsletter.vol = true;
            $scope.newsletterModal = $modal({
                scope: $scope,
                template: 'views/modal/newsletter.html',
                show: false
            });
            $scope.newsletterModal.$promise.then($scope.newsletterModal.show);

        };
        $scope.sendNewsletterRegistartion = function(isValid){
          $scope.doLoad = true;
          Newsletter.registration({},$scope.newsletter, function(data){
            $scope.doLoad = false;
            if(data.success == true){
              $scope.newsletterModal.hide();
              FlashService.show(data.msg,'', 'success');
            }else {
              FlashService.show(data.msg,'', 'danger');
            }
          });
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
