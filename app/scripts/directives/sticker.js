'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:sticker
 * @description
 * # sticker
 */
angular.module('osApp')

.directive('sticker', function($document, $window, $timeout, $rootScope) {
    return {
        restrict: 'A',
        link: function postLink(scope, element) {
            var header = angular.element(document.getElementById('header'));
            var navigation = angular.element(document.getElementById('navigation'));
            var top = angular.element(document.getElementById('content_container'));
            var scrollbar = element.find('.scrollbar');
            var list = element.find('.items');
            var catContainer = list.find('.items').find('.row');
            var isLoaded = false;
            var mainHeader = element.parent().parent().find('.article');
            var conHeight = 0;
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
                //prev: angular.element(document.getElementById('articlesToPreview')),
                keyboardNavBy: 'items'

            });
            sly.on('load', function() {
                isLoaded = true;
                console.log('sticker');
            });

            scope.checkDim = function() {

                var catContainer = list.find('.slide');
                catContainer.css({
                    height: (conHeight + 31) + 'px'
                });
                var slyScrollContainer = angular.element(document.getElementById('sly-scroll-container'));
                var varscroll = parseInt($document.scrollTop());
                if ($window.innerWidth > 960) {
                    if (varscroll > header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight()) {

                        element
                            .addClass('headroom--not-top')
                            .css({
                                'transform': 'translateY(-' + (header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight()) + 'px)',
                                '-webkit-transform': 'translateY(-' + (header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight()) + 'px)'
                            });

                        if (slyScrollContainer.innerHeight() + 30 > ($window.innerHeight - navigation.innerHeight())) {

                            list.css({
                                'height': ($window.innerHeight - navigation.innerHeight() - 30) + 'px'
                            });
                            scrollbar.css({
                                'height': ($window.innerHeight - navigation.innerHeight() - 30) + 'px'
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
                            if (sly.initialized) {
                                sly.destroy();
                            }

                        }
                    } else {
                        element
                            .removeClass('headroom--not-top')
                            .css({
                                'transform': 'translateY(0px)',
                                '-webkit-transform': 'translateY(0px)'
                            });
                        //sly.destroy();
                        //scrollbar.hide();

                    }
                } else {
                    if (varscroll > header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight() + $('#smart').height()) {

                    }
                }
            };
            $document.on('scroll', function() {
                $timeout(function() {
                    scope.checkDim();
                });
            });
            scrollbar.hide();
            $timeout(function() {
                scope.checkDim();
            });
            angular.element($window).bind('resize', function() {
                scope.checkDim();
                //sly.reload();
            });
            $rootScope.$on('nextConnection', function(s, index) {
                var con = angular.element(document.getElementById('connections_list'));
                if (con.length > 0) {
                    $timeout(function() {
                        conHeight = con.find('.article_thumb').eq(index).height();

                        scope.checkDim();

                    });
                } else {
                    $timeout(function() {
                        conHeight = 0;
                        scope.checkDim();
                    });
                }
            });
        }
    };
});