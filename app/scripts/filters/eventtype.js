'use strict';

/**
 * @ngdoc filter
 * @name osApp.filter:eventtype
 * @function
 * @description
 * # eventtype
 * Filter in the osApp.
 */
angular.module('osApp')
    .filter('eventtype', function() {
        return function(input, value) {
            if (typeof value == "undefined" || !value) {
                return input;
            } else {
                var data = [];
                angular.forEach(input, function(item, key) {
                    if (value == "solo") {
                        if (item.solo == 1) {
                            data.push(item)
                        }
                    } else if (value == "groups") {
                        if (item.groups == 1) {
                            data.push(item);
                        }
                    }
                });
                return data;
            }
        };
    });
