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
    })
    .directive('subswitcher', function($timeout){
      return {
        restrict: 'AC',
        template: '<i class="fa fa-chevron-down" ng-class="{open: opened}"></i>',
        link: function(scope,element, attrs){
          $timeout(function(){
            var sub = $(element).parent().find('ul');
            var height  = sub.height();

            element.on('click', function(e){
              if(sub.css('height') == '0px'){
                  sub.css({'height': height});

              }
              else{
                  sub.css({'height': 0});

              }

            });
          });

        }
      };
    });
