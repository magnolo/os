'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:NewsletterCtrl
 * @description
 * # NewsletterCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('NewsletterCtrl', function($scope, $timeout, $document, $stateParams, $modal, FlashService, Newsletter, Article) {
        $scope.status = 'loading';
        $scope.colors = [{
            name: 'normal',
            title: 'Standard'
        }, {
            name: 'os',
            title: 'OpenScience'
        }, {
            name: 'wissen',
            title: 'Wissen'
        }, {
            name: 'projekte',
            title: 'Projekte'
        }, {
            name: 'schulcorner',
            title: 'Schulcorner'
        }, {
            name: 'vol',
            title: 'Vienna Open Lab'
        }];
        $scope.color = {
            'wissen': '523C7C',
            'schulcorner': '858D1E',
            'projekte': '1DA9C7',
            'vol': 'A31031'
        };
        $scope.overview = [];
        $scope.newsletter = Newsletter.get({
            newsId: $stateParams.id
        }, function() {
            Newsletter.campaign({
                id: $scope.newsletter.mailchimp_id
            }, function(response) {
                $scope.newsletter.mailchimp = response.data[0];

            });
        });
        $scope.list = Newsletter.list();
        $scope.$watchCollection('newsletter.mailchimp', function(newItem, oldItem) {
            if (newItem == oldItem) {
                return;
            } else {
                $scope.status = newItem.status;
            }
        });

        function scrollBottom() {
            console.log($('.full-fixed').height());
            $timeout(function() {
                $('.full-fixed').animate({
                    scrollTop: ($('#newsletter-box').height())
                }, 250);
                console.log($('.full-fixed').height());
            });
        };
        $scope.openArticlesModal = function() {
            if ($scope.overview.length == 0) {
                $scope.overview = Article.overview({
                    images: true
                });
            }
            $scope.articlesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/articles_drop.html'
            });
        };
        $scope.toggleSortFilter = function(sec) {
            if ($scope.sortFilter == sec) {
                $scope.sortFilter = '';
            } else {
                $scope.sortFilter = sec;
            }

        };

        $scope.addTitle = function() {
            $scope.addingTitle = true;
            $scope.newTitle = {};
            $scope.titleModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/newsletter_title.html',
                show: false
            });
            $scope.titleModal.$promise.then(function() {
                $scope.titleModal.show();
            });
        };
        $scope.insertTitle = function(isValid) {
            if (isValid) {
                if ($scope.addingTitle) {
                    var item = {
                        title: $scope.newTitle.title,
                        type: {
                            name: 'header',
                            intern: 'additional',
                            'class': $scope.newTitle.type.class,
                            'typClass': 'title'
                        },
                        size: 2
                    };
                    if (typeof $scope.newsletter.items == "undefined") {
                        $scope.newsletter.items = [];
                    }
                    $scope.newsletter.items.push(item);
                    scrollBottom();
                }

                $scope.titleModal.hide();

            }
        };
        $scope.editTitle = function(item) {
            console.log(item);
            $scope.addingTitle = false;
            $scope.newTitle = item;
            $scope.titleModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/newsletter_title.html',
                show: false
            });
            $scope.titleModal.$promise.then(function() {
                $scope.titleModal.show();
            });
        };
        $scope.addText = function() {
            $scope.addingText = true;
            $scope.newText = {};
            $scope.textModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/newsletter_text.html',
                show: false
            });
            $scope.textModal.$promise.then(function() {
                $scope.textModal.show();
            });
        };
        $scope.editText = function(item) {
            $scope.addingText = false;
            $scope.newText = item;
            $scope.textModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/newsletter_text.html',
                show: false
            });
            $scope.textModal.$promise.then(function() {
                $scope.textModal.show();
            });
        };
        $scope.insertText = function(isValid) {
            if (isValid) {
                if ($scope.addingText) {
                    var item = {
                        text: $scope.newText.text,
                        type: {
                            name: 'text',
                            intern: 'additional',
                            'class': $scope.newText.type.class,
                            'typClass': 'text',
                            size: 2
                        }
                    };
                    if (typeof $scope.newsletter.items == "undefined") {
                        $scope.newsletter.items = [];
                    }
                    $scope.newsletter.items.push(item);
                    scrollBottom();
                }
                $scope.textModal.hide();

            }
        };

        $scope.deleteItem = function(index) {
            $scope.newsletter.items.splice(index, 1);
        };
        $scope.sizeUp = function(item) {
            item.size = 2;
        };
        $scope.sizeDown = function(item) {
            item.size = 1;
        };
        $scope.toggleArticle = function(art) {

            if (typeof $scope.newsletter.items == "undefined") {
                $scope.newsletter.items = [];
            }
            var found = false;
            angular.forEach($scope.newsletter.items, function(item, key) {
                if (art.type == item.type.name && art.id == item.id) {
                    $scope.newsletter.items.splice(key, 1);
                    found = true;
                    console.log(item);
                    console.log(key);
                    console.log(art);
                }
            });
            if (!found) {
                if (art.type == 'class') {

                } else if (art.type == 'article') {
                    var item = {
                        id: art.id,
                        title: art.title,
                        categorie: art.categorie.title,
                        image: art.image,
                        intro: art.intro || art.text.substring(0, art.text.indexOf('.') + 1),
                        size: 3,
                        type: {
                            name: art.type,
                            intern: 'articles',
                            'class': art.section.name,
                            'typClass': 'article'

                        }
                    };
                }
                $scope.newsletter.items.push(item);
                scrollBottom();
            }

        };
    });
