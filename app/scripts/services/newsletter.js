'use strict';

/**
 * @ngdoc service
 * @name osApp.Newsletter
 * @description
 * # Newsletter
 * Factory in the osApp.
 */
angular.module('osApp')
    .factory('Newsletter', function($resource) {
        return $resource('http://www.openscience.or.at/:folder/:location/:newsId/:action', {}, {
            query: {
                method: 'GET',
                params: {
                    folder: 'api',
                    location: 'newsletters'
                },
                isArray: true,
            },
            get: {
                method: 'GET',
                params: {
                    folder: 'api',
                    location: 'newsletter'
                },

            },
            campaigns: {
                method: 'GET',
                params: {
                    folder: 'assets',
                    location: 'ajax',
                    newsId: 'mailchimper.php',
                    fetch: 'campaigns'
                }
            },
            list: {
                method: 'GET',
                params: {
                    folder: 'assets',
                    location: 'ajax',
                    newsId: 'mailchimper.php',
                    fetch: 'list'
                }
            },
            campaign: {
                method: 'GET',
                params: {
                    folder: 'assets',
                    location: 'ajax',
                    newsId: 'mailchimper.php',
                    fetch: 'campaign',
                    id: ''
                }
            },
            content: {
                method: 'GET',
                params: {
                    folder: 'assets/ajax/mailchimper.php',
                    location: 'ajax',
                    newsId: 'mailchimper.php',
                    fetch: 'content',
                    id: ''
                }
            },
            create: {
                method: 'POST',
                params: {
                    folder: 'api',
                    location: 'newsletters'
                }
            },
            createChimp: {
                method: 'POST',
                params: {
                    folder: 'assets',
                    location: 'ajax',
                    newsId: 'mailchimper.php',
                }
            },
            remove: {
                method: 'DELETE',
                params: {
                    folder: 'api',
                    location: 'newsletters',
                    newsId: ''
                }
            },
            sort: {
                method: 'PUT',
                params: {
                    partnerId: 'sort'
                }
            },
            configs: {
                method: 'GET',
                params: {
                    folder: 'newsletters',
                    location: 'configs'

                },
                isArray: true
            },
            config: {
                method: 'GET',
                params: {
                    folder: 'api',
                    location: 'newsletters',
                    newsId: 'configs'

                }

            }

        });
    });
