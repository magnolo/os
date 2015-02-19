'use strict';

/**
 * @ngdoc filter
 * @name osApp.filter:unsafe
 * @function
 * @description
 * # unsafe
 * Filter in the osApp.
 */
angular.module('osApp')
    .filter('unsafe', function($sce) {
        return $sce.trustAsHtml;
    });
