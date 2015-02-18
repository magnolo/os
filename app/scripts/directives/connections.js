'use strict';

angular.module('osApp')
    .directive('connections', function($timeout, $document, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'views/directive/connections.html',
            replace: true,
            scope: {
                articles: '=',
                article: '='
            },
            link: function(scope) {

                scope.colors = {
                    'wissen': '523C7C',
                    'schulcorner': '858D1E',
                    'projekte': '1DA9C7',
                    'vol': 'A31031'
                };
                scope.$watch('articles', function(value, old) {
                    if (value === old) {
                        return;
                    }
                    scope.reset();
                });
                scope.currentIndex = 0;
                var timer;
                var sliderFunc = function() {
                    timer = $timeout(function() {
                        scope.next();
                        timer = $timeout(sliderFunc, 5000);
                    }, 5000);
                };
                scope.reset = function() {
                    $timeout.cancel(timer);
                    if (typeof scope.articles.$promise !== 'undefined') {
                        scope.articles.$promise.then(function() {
                            scope.articles.forEach(function(article) {
                                article.visible = false; // make every image invisible
                            });
                            if (scope.articles.length > 0) {
                                scope.articles[0].visible = true; // make the current image visible
                                scope.currentIndex = 0;
                                sliderFunc();
                                scope.setLiner();
                            }
                        });
                    }

                };
                scope.next = function(resetTimer) {
                    if (scope.currentIndex < scope.articles.length - 1) {
                        scope.currentIndex++;
                    } else {
                        scope.currentIndex = 0;
                    }
                    if (resetTimer) {
                        $timeout.cancel(timer);
                        sliderFunc();
                    }
                };
                scope.prev = function(resetTimer) {
                    if (scope.currentIndex > 0) {
                        scope.currentIndex--;
                    } else {
                        scope.currentIndex = scope.articles.length - 1;
                    }
                    if (resetTimer) {
                        $timeout.cancel(timer);
                        sliderFunc();
                    }
                };
                scope.setLiner = function() {
                    /*if (scope.articles.length > 0) {
                        $timeout(function() {
                            var link = angular.element(document.getElementById(scope.article + '_link'));
                            var liner = angular.element(document.getElementById('connection-liner'));
                            var linerNeg = angular.element(document.getElementById('connection-liner-neg'));
                            var connect = angular.element(document.getElementById('connect'));
                            if (typeof link.position() !== 'undefined' && typeof connect.position() !== 'undefined') {
                                if (connect.position().top > link.position().top) {
                                    linerNeg.hide();
                                    liner.css({
                                        'height': Math.abs(connect.position().top - link.position().top),
                                        'top': (connect.position().top - Math.abs(connect.position().top - link.position().top) + 15)
                                    }).show();
                                } else {
                                    linerNeg.css({
                                        'height': Math.abs(connect.position().top - link.position().top),
                                        'top': (connect.position().top + 15)
                                    }).show();
                                    liner.hide();
                                }
                            }

                        });
                    }*/
                };
                scope.$watch('currentIndex', function(i) {
                    if (scope.articles.length > 0) {
                        scope.articles.forEach(function(article) {
                            article.visible = false; // make every image invisible
                        });
                        scope.articles[i].visible = true; // make the current image visible
                        scope.setLiner();
                        $rootScope.$broadcast('nextConnection', i);
                    }
                });

                //sliderFunc();
                scope.reset();
                scope.$on('$destroy', function() {

                    $timeout.cancel(timer); // when the scope is getting destroyed, cancel the timer
                });
                $rootScope.$on('slyscroll', function() {
                    //scope.setLiner();
                });

                /*$document.on('scroll', function() {
                    var menu = angular.element(document.getElementById('smarter'));
                    var link = angular.element(document.getElementById(scope.article + '_link'));
                    var liner = angular.element(document.getElementById('connection-liner'));
                    var connect = angular.element(document.getElementById('connect'));
                    console.log(menu.position());
                    console.log(link.position());
                    console.log(scope.article);

                    liner.css({
                        'height': Math.abs(connect.position().top - link.position().top),
                        'top': (connect.position().top - Math.abs(connect.position().top - link.position().top) + 15)
                    });
                })*/


                /* var connection = angular.element(document.getElementById('connect'));
                            var line = angular.element(document.getElementById('connection-liner'));
                            var article_list = angular.element(document.getElementById('smarter'));
                            var article = angular.element(document.querySelectorAll('#cat_articles .active'));
                            /*line.css({
                            'position': 'fixed',
                            'top': 0,
                            'right': '-11px',
                            'height': connection.position().top - article.position().top,
                            'width': '3px',
                            'z-index': '5',
                            'background': '#000'
                        });

                            // debugger;
                            console.log(connection.position());
                            console.log(article_list);
                            $document.on('scroll', function() { 

                            });*/


            }

        };
    });
