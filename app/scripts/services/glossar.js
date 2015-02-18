'use strict';

/**
 * @ngdoc service
 * @name osApp.Glossar
 * @description
 * # Glossar
 * Factory in the osApp.
 */
angular.module('osApp')
  .factory('Glossar', function($resource) {
    return $resource('http://www.openscience.or.at/api/glossar/:glossarId/:type', {}, {
      query: {
        method: 'GET',
        params: {
          glossarId: ''
        },
        isArray: true
      },
      get: {
        method: 'GET',
        params: {
          glossarId: ''
        }
      },
      create: {
        method: 'POST'
      },
      update: {
        method: 'PUT'
      },
      remove: {
        method: 'DELETE'
      }

    });
  });