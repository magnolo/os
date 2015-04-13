'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:sticktop
 * @description
 * # sticktop
 */
angular.module('osApp')
  .directive('sticktop', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the sticktop directive');
      }
    };
  });
