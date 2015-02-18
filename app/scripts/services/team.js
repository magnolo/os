'use strict';

/**
 * @ngdoc service
 * @name osApp.team
 * @description
 * # team
 * Factory in the osApp.
 */
angular.module('osApp')
  .factory('team', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
