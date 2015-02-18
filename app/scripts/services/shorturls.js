'use strict';

/**
 * @ngdoc service
 * @name osApp.shorturls
 * @description
 * # shorturls
 * Factory in the osApp.
 */
angular.module('osApp')
  .factory('Shorturls', function($resource) {
    return $resource('http://www.openscience.or.at/api/shorturls/:id/:action', {}, {
      query: {
        method: 'GET',
        isArray: true
      },
      update: {
        method: 'PUT',
        params: {
          id: ''
        }
      },
      create: {
        method: 'POST'
      },
      remove: {
        method: 'DELETE'
      }
    });
  });