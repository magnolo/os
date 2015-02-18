'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:totext
 * @description
 * # totext
 */
angular.module('osApp')
  .directive('totext', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the totext directive');
      }
    };
  });
