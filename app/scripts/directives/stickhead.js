'use strict';

angular.module('osApp')
    .directive('stickhead', function($document) {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                var navigation = angular.element(document.getElementById('navigation'));
                var body = angular.element(document.getElementById('body'));
                $document.on('scroll', function() {
                    var varscroll = parseInt($document.scrollTop());
                    if (varscroll > element.innerHeight() - navigation.innerHeight()) {
                        body.addClass('fixed');
                        $('#wrapper').css({
                            'padding-top': element.innerHeight()
                        }).trigger('click');
                        element
                            .css({
                                'transform': 'translateY(-' + (element.innerHeight() - navigation.innerHeight()) + 'px)',
                                '-webkit-transform': 'translateY(-' + (element.innerHeight() - navigation.innerHeight()) + 'px)'
                            })
                            .addClass('headroom--not-top');


                    } else {
                        body.removeClass('fixed');
                        element
                            .removeClass('headroom--not-top')
                            .css({
                                'transform': 'translateY(0px)'
                            });
                        $('#wrapper').css({
                            'padding-top': 0
                        });
                    }
                });
            }
        };
    });