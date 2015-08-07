'use strict';

angular.module('osApp')
    .filter('bysection', function($timeout) {
        return function(items, value, scope) {
            if (typeof value === 'undefined') {
                return items;
            }
            var result = [];
            angular.forEach(items, function(item, key) {
                if (typeof item.sections !== 'undefined') {
                    if (item.sections.indexOf(value) !== -1) {
                        result.push(item);
                    }
                } else {
                    result.push(item);
                }
            });
            return result;
        };
    })
    .filter('toint', function() {
        return function(item) {
            return parseInt(item);
        };
    })
    .filter('insection', function() {
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
    .filter('inlist', function() {
        return function(item, values, scope) {
            var found = "";
            angular.forEach(values, function(value, key) {
                if (item.id == value) {
                    found = "selected"
                }
            })
            return found;
        };
    })
    .filter('byid', function() {
        return function(items, values, scope) {
            var list = [];
            angular.forEach(items, function(item, k) {
                angular.forEach(values, function(value, key) {
                    if (item.id == value) {
                        list.push(item);
                    }
                });
            });
            return list;
        };
    })
    .filter('section', function() {
        return function(items, value, scope) {
            if (typeof value === 'undefined' || value == '') {
                return items;
            }
            var result = [];
            angular.forEach(items, function(item, key) {
                if (typeof item.section !== 'undefined') {
                    if (item.section.name == value) {
                        result.push(item);
                    }
                } else {
                    result.push(item);
                }
            });
            return result;
        };
    })
    .filter('orderbycat', function(orderByFilter){
        return function(items, value, scope){
          if(items.length > 0){
          if(items[0].categorie.name == "projekte-a-z"){
            items = orderByFilter(items, '+name');
          }
        }
          return items;
        }
    })
    .filter('bydater', function($timeout) {
        return function(items, value, scope) {
            if (items.length == 0 || !value) {
                return items
            }

            if (typeof value == 'undefined') {
                return items;
            }
            var result = [];

            angular.forEach(items, function(item, key) {
                if (item.date.indexOf(value.substring(0, 7)) !== -1) {
                    result.push(item);
                }
            });
            // console.log(items);

            return result;
        };
    });
