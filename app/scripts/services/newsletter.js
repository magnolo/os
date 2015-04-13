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
        return $resource('http://www.openscience.or.at/:folder/:location/:newsId/:action/:id', {}, {
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
                    folder: 'api',
                    location: 'mailchimp',
                    action: 'campaigns'
                }
            },
            list: {
                method: 'GET',
                params: {
                    folder: 'api',
                    location: 'mailchimp',
                    newsId: 'lists'
                }
            },
            campaign: {
                method: 'GET',
                params: {
                    folder: 'api',
                    location: 'mailchimp',
                    newsId: 'campaigns',
                    id: ''
                }
            },
            content: {
                method: 'GET',
                params: {
                    folder: 'api',
                    location: 'mailchimp',
                    newsId: 'mailchimper.php',
                    fetch: 'content',
                    id: ''
                }
            },
            /*create: {
                method: 'POST',
                params: {
                    folder: 'api',
                    location: 'newsletters'
                }
            },*/
            createChimp: {
                method: 'POST',
                params: {
                    folder: 'api',
                    location: 'mailchimp',
                    newsId: 'campaigns',
                }
            },
            update: {
                method: 'PUT',
                params: {
                    folder: 'api',
                    location: 'mailchimp',
                    newsId: 'campaigns',
                    id: ''
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
            removeCampaign: {
                method: 'DELETE',
                params: {
                    folder: 'api',
                    location: 'mailchimp',
                    action: 'campaigns',
                    id: ''
                }
            },
            sendTest: {
                method: 'PUT',
                params: {
                    folder: 'api',
                    location: 'mailchimp',
                    newsId: 'campaigns',
                    action: '',
                    id: 'testmail'
                }
            },
            sendCampaign: {
                method: 'POST',
                params: {
                    folder: 'api',
                    location: 'mailchimp',
                    newsId: 'campaigns',
                    action: '',
                    id: 'send'
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