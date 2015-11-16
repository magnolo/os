'use strict';

angular.module('osApp')
    .controller('WissenCtrl', function($scope, $modal, $rootScope, $stateParams, Categorie, Article, FlashService, Quiz) {
        var articleId = 0;
        $scope.quiz = [];
        $scope.color = '523C7C';
        $scope.section = $stateParams.section;
        switch ($stateParams.section) {
            case 'wissen':
                articleId = 611;
                $scope.color = '523C7C';
                break;
            case 'projekte':
                articleId = 609;
                $scope.color = '1DA9C7';
                break;
            case 'schulcorner':
                articleId = 610;
                $scope.color = '858D1E';
                break;
        }
        $scope.article = Article.get({
            articleId: articleId
        }, function(data){
          $rootScope.activateArticle(data);
        });
        $scope.categorie = Categorie.categorie({
            categorieName: $stateParams.section
        }, function() {
            $scope.categorie = $scope.categorie[0];
        });
        $scope.quiz = Quiz.byCategorie({
            typeId: $stateParams.section
        });


        //ADMIN PART
        $scope.editCategorie = {};
        $scope.doSorting = false;
        $scope.showOffline = false;
        $scope.setCatContext = function(categorie) {
            $scope.editCategorie = categorie;
        };
        $scope.editCat = function() {
            $scope.catModal = $modal({
                scope: $scope,
                show: false,
                template: 'views/admin/modal/categorie.html'
            });
            $scope.catModal.$promise.then($scope.catModal.show);
        };
        $scope.newCat = function() {
            $scope.editCategorie = {};
            console.log($scope.categorie);
            $scope.catModal = $modal({
                scope: $scope,
                show: false,
                template: 'views/admin/modal/categorie.html'
            });
            $scope.catModal.$promise.then($scope.catModal.show);
        };
        $scope.editCat = function() {
            $scope.catModal = $modal({
                scope: $scope,
                show: false,
                template: 'views/admin/modal/categorie.html'
            });
            $scope.catModal.$promise.then($scope.catModal.show);
        };
        $scope.toggleActivation = function(value) {
            $scope.editCategorie.active = value;
            $scope.saveCat(true);
        };
        $scope.saveCat = function(isValid) {
            if (isValid) {
                if ($scope.editCategorie.id) {
                    Categorie.update({
                        categorieName: $scope.editCategorie.id
                    }, {
                        title: $scope.editCategorie.title,
                        active: $scope.editCategorie.active,
    										title_en : $scope.editCategorie.title_en
                    }, function(response) {
                        if (response.status == true) {
                            if (typeof $scope.catModal != "undefined") {
                                $scope.catModal.hide();
                            }
                            FlashService.show(response.message, '', 'success');
                        } else {
                            FlashService.show('Speichern Fehlgeschlagen', '', 'danger', 5);
                        }
                    })
                } else {
                    Categorie.create({}, {
                        title: $scope.editCategorie.title,
                        active: $scope.editCategorie.active,
                        parent_id: $scope.categorie.id,
    										title_en : $scope.editCategorie.title_en
                    }, function(response) {
                        if (response.status == true) {
                            $scope.categorie.categories.push(response.categorie);
                            if (typeof $scope.catModal != "undefined") {
                                $scope.catModal.hide();
                            }
                            FlashService.show(response.message, '', 'success');
                        } else {
                            FlashService.show('Speichern Fehlgeschlagen', '', 'danger', 5);
                        }
                    })
                }
            }
        };
        $scope.deleteCat = function() {
            $scope.articles = Categorie.get({
                categorieName: $scope.categorie.name,
                type: $scope.editCategorie.name,
                action: 'articles',
                order: 'position'
            }, function(response) {
                if ($scope.articles.length > 0) {
                    alert('Diese Kategorie beinhaltet ' + $scope.articles.length + ' Beitrage!\nLöschen nicht möglich!');
                } else {
                    if (confirm('Die Kategorie\n' + $scope.editCategorie.title + '\nentgültig entfernen?')) {
                        Categorie.remove({
                            categorieName: $scope.editCategorie.id
                        }, function(response) {
                            if (response.status == true) {
                                $scope.categorie.categories.splice($scope.categorie.categories.indexOf($scope.editCategorie), 1);
                                FlashService.show(response.message, '', 'success');
                            } else {
                                FlashService.show('Löschen Fehlgeschlagen', '', 'danger', 5);
                            }
                        })
                    }
                }
            });
        };
        $scope.toggleSorting = function() {
            $scope.doSorting = ($scope.doSorting == false ? true : false);
        };
        $scope.sortCategories = {
            orderChanged: function(event) {
                var list = [];
                angular.forEach($scope.categorie.categories, function(cat) {
                    list.push(cat.id);
                });
                Categorie.sort({
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
        $scope.toggleOffline = function(type) {
            $scope.showOffline = type;
        };
    });
