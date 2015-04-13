'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:sticktop
 * @description
 * # sticktop
 */
angular.module('osApp')
    .directive('sticktop', function($timeout) {
        return {
            restrict: 'EAC',
            link: function postLink(scope, element, attrs) {
                var cont = angular.element($('.full-fixed'));
                cont.on('scroll', function() {
                    var varscroll = parseInt(cont.scrollTop());

                    if (varscroll > 10) {
                        element.css({
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            'z-index': 10
                        }).addClass('row');
                        cont.css({
                            'padding-top': '58px'
                        })
                    } else {
                        element.css({
                            position: 'static'
                        }).removeClass('row');
                        cont.css({
                            'padding-top': '0px'
                        })
                    }
                });
            }
        };
    });