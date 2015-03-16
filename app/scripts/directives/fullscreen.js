'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:fullscreen
 * @description
 * # fullscreen
 */
angular.module('osApp')
    .directive('fillscreen', function(Fullscreen) {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {
                $(element).on('click', function() {
                    if ($('#categorie_container').hasClass('fullscreen')) {
                        $('#categorie_container').removeClass('fullscreen');
                        Fullscreen.cancel();
                    } else {
                        $('#categorie_container').addClass('fullscreen');
                        Fullscreen.all();

                    }
                });
                $(document).keyup(function(e) {
                    if (e.keyCode == 27) {
                        if ($('#categorie_container').hasClass('fullscreen')) {
                            $('#categorie_container').removeClass('fullscreen');
                            Fullscreen.cancel();
                        }
                    }
                });
            }
        };
    });