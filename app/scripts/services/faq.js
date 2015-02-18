'use strict';

angular.module('osApp')
    .factory('Faq', function($resource) {
        return $resource('http://www.openscience.or.at/api/faqs/:faqId/:type', {}, {
            query: {
                method: 'GET',
                params: {
                    faqId: ''
                },
                isArray: true
            },
            get: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            },
            create: {
                method: 'POST'
            },
            remove: {
                method: 'DELETE'
            },
            sort: {
                method: 'PUT',
                params: {
                    faqId: 'position'
                }
            }

        });
    });
