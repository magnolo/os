'use strict';

/**
 * @ngdoc service
 * @name osApp.user
 * @description
 * # user
 * Factory in the osApp.
 */
angular.module('osApp')
  .factory('User', function($resource) {
    return $resource('http://www.openscience.or.at/api/accounts/:tagId', {}, {
      get:{
        method:'GET'
      },
      query: {
        method: 'GET',
        params: {
          tagId: ''
        },
        isArray: true
      },
      update: {
        method: 'PUT'
      },
      remove: {
        method: 'DELETE'
      },
      create: {
        method: 'POST'
      }

    });
  });
