'use strict';

angular.module('osApp')
    .factory('Guestbook', function($resource) {
        return $resource('http://www.openscience.or.at/api/guestbook/:id/:type', {}, {
            query: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: true
            },
            get: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            },
            remove: {
                method: 'DELETE'
            },
            add: {
                method: 'POST'
            }

        });
    });
