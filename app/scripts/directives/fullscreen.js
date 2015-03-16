'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:fullscreen
 * @description
 * # fullscreen
 */
angular.module('osApp')
    .directive('fullscreen', function() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).on('click', function() {
                    if ($('#categorie_container').hasClass('fullscreen')) {
                        $('#categorie_container').removeClass('fullscreen');
                    } else {
                        $('#categorie_container').addClass('fullscreen');

                    }
                });
                $(document).keyup(function(e) {
                    if (e.keyCode == 27) {
                        if ($('#categorie_container').hasClass('fullscreen')) {
                            $('#categorie_container').removeClass('fullscreen');
                        }
                    }
                });
            }
        };
    });