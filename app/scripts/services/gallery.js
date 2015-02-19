'use strict';

/**
 * @ngdoc service
 * @name osApp.Gallery
 * @description
 * # Gallery
 * Factory in the osApp.
 */
angular.module('osApp')
    .factory('Gallery', function($resource) {
        return $resource('http://www.openscience.or.at/api/galleries/:id/:action', {}, {
            query: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: true
            },
            dates: {
                method: 'GET',
                params: {
                    id: 'dates'
                },
                isArray: true
            },
            get: {
                method: 'GET'
            }

        });
    });
