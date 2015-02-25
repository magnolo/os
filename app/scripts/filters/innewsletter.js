'use strict';

/**
 * @ngdoc filter
 * @name osApp.filter:innewsletter
 * @function
 * @description
 * # innewsletter
 * Filter in the osApp.
 */
angular.module('osApp')
    .filter('innewsletter', function() {
        return function(item, values, scope) {
            var found = "";
            angular.forEach(values, function(value, key) {
                if (item.id == value.id) {
                    found = "selected"
                }
            })
            return found;
        };
    })
