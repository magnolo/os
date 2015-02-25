'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:sticky
 * @description
 * # sticky
 */
angular.module('osApp')
    .directive('stickon', function() {
        return {
            restrict: 'A',
            link: function postLink(scope, element, attrs) {

                $(element).stick_in_parent().on("sticky_kit:stick", function(e) {
                    console.log("has stuck!", e.target);
                });

            }
        };
    });
