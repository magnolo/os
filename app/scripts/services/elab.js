'use strict';

/**
 * @ngdoc service
 * @name osApp.elab
 * @description
 * # elab
 * Factory in the osApp.
 */
angular.module('osApp')
    .factory('Elab', function($resource) {
        return $resource('http://www.openscience.or.at/api/elab/:type/:id', {}, {
            sections: {
                method: 'GET',
                params: {
                    type: 'sections'
                },
                isArray: true
            },
            section: {
                method: 'GET',
                params: {
                    type: 'sections'
                }
            },
            sectionLabs: {
                method: 'GET',
                params: {
                    id: 'elabs'
                },
                isArray: true
            },
            elabs: {
                method: 'GET',
                isArray: true
            },
            get: {
                method: 'GET',
                params: {
                    type: 'name'
                }
            },
            create: {
                method: 'POST',
                params: {
                    type: 'sections'
                }
            },
            update: {
                method: 'PUT',
                params: {
                    type: 'sections'
                }
            },
            updateElabentry: {
                method: 'PUT'

            },
            addElabentry: {
                method: 'POST'
            },
            removeElabentry: {
                method: 'DELETE'
            }
        });
    });