/*global Sly */
'use strict';

angular.module('osApp')
    .directive('stick', function($document, $window, $timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                var header = angular.element(document.getElementById('header'));
                var navigation = angular.element(document.getElementById('navigation'));
                var top = angular.element(document.getElementById('content_container'));
                var scrollbar = element.find('.scrollbar');
                var list = element.find('.items');
                var fMenu = element.find('.functions_menu');
                var container = element.find('#cat_articles');
                var isLoaded = false;
                var mainHeader = element.parent().parent().find('.article');

                var sly = new Sly(list, {
                    //itemNav:'basic',
                    speed: 100,
                    smart: 1,
                    //easing: 'easeOutExpo',
                    // pagesBar: $wrap.find('.pages'),
                    activateOn: 'click',
                    activatePageOn: 'click',
                    scrollBar: element.find('.scrollbar'),
                    scrollBy: 100,
                    dragHandle: 1,
                    mouseDragging: 0,
                    touchDragging: 1,
                    dynamicHandle: 1,
                    clickBar: 1,
                    releaseSwing: true,
                    prev: angular.element(document.getElementById('articlesToPreview')),
                    keyboardNavBy: 'items'

                });
                sly.on('load', function() {
                    isLoaded = true;
                    console.log('stick');
                });
                sly.on('move', function() {
                    $rootScope.$broadcast('slyscroll');
                });

                scope.checkPosition = function() {
                    if (isLoaded) {
                        $timeout(function() {
                            var item = element.find('.active');
                            var menu = element.find('.scroll_menu');
                            $timeout(function() {
                                if (item.position().top > menu.innerHeight() / 2) {
                                    sly.toEnd();
                                } else {
                                    sly.toStart();
                                }
                            }, 300);
                        });
                    }
                };
                scope.checkDim = function() {
                    var varscroll = parseInt($document.scrollTop());
                    if (varscroll > header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight()) {
                        element
                            .addClass('headroom--not-top')
                            .css({
                                'transform': 'translateY(-' + (header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight()) + 'px)'

                            });

                        if ((container.innerHeight() + fMenu.innerHeight() + 50) > ($window.innerHeight - navigation.innerHeight() + 20)) {
                            list.css({
                                'height': ($window.innerHeight - navigation.innerHeight() - 30 - fMenu.innerHeight()) + 'px'
                            });
                            scrollbar.css({
                                'height': ($window.innerHeight - navigation.innerHeight() - 30 - fMenu.innerHeight()) + 'px'
                            });
                            if (isLoaded) {
                                sly.reload();
                            } else {
                                sly.init();
                            }
                            scrollbar.show();
                        } else {
                            isLoaded = false;
                            scrollbar.hide();
                            sly.destroy();
                        }

                    } else {
                        element
                            .removeClass('headroom--not-top')
                            .css({
                                'transform': 'translateY(0px)'

                            });
                        //sly.destroy();
                        //scrollbar.hide();
                    }
                };
                $document.on('scroll', function() {
                    scope.checkDim();
                });
                scrollbar.hide();
                $timeout(function() {
                    scope.checkDim();

                });
                angular.element($window).bind('resize', function() {
                    scope.checkDim();
                    //sly.reload();
                });

            }
        };
    });
