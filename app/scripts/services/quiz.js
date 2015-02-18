'use strict';

angular.module('osApp')
  .factory('Quiz', function($resource) {
    return $resource('http://www.openscience.or.at/api/quiz/:quizId', {}, {
      query: {
        method: 'GET',
        params: {
          quizId: ''
        },
        isArray: true
      },
      get: {
        method: 'GET'
      }
    });
  });