'use strict';

angular.module('osApp')
    .factory('Events', function($resource) {
        return $resource('http://www.openscience.or.at/api/:kind/:eventId/:action/:actionKind', {}, {
            query: {
                method: 'GET',
                params: {
                    eventId: ''
                },
                isArray: true
            },
            get: {
                method: 'GET'
            },
            list: {
                params: {
                    kind: 'plus',
                    eventId: 'events.php'
                },
                isArray: true
            },
            check: {
                params: {
                    kind: 'dates'
                }
            },
            update: {
                method: 'PUT',
                params: {
                    kind: 'events',
                    eventId: ''
                }
            },
            create: {
                method: 'POST',
                params: {
                    kind: 'events'
                }
            },
            createTicket: {
                method: 'POST',
                params: {
                    kind: 'ticket'
                }
            },
            createClosed: {
                method: 'POST',
                params: {
                    kind: 'closed'
                }
            },
            deleteGroupEvent: {
                method: 'DELETE',
                params: {
                    kind: 'ticket'
                }
            },
            deleteTicket: {
                method: 'DELETE',
                params: {
                    kind: 'ticket'
                }
            },
            deleteClosedEvent: {
                method: 'DELETE',
                params: {
                    kind: 'closed'
                }
            },
            addImage: {
                method: 'POST',
                params: {
                    kind: 'events',
                    eventId: '',
                    action: 'images',
                    actionKind: ''
                }
            },
            removeImage: {
                method: 'DELETE',
                params: {
                    kind: 'events',
                    eventId: '',
                    action: 'images',
                    actionKind: ''
                }
            },
            sortimages: {
                method: 'PUT',
                params: {
                    kind: 'events',
                    eventId: '',
                    action: 'images',
                    actionKind: 'sort'
                }
            },
            bookings: {
                mehtod: 'GET',
                params: {
                    kind: 'bookings',
                    type: 'all'
                },
                isArray: true
            }
        });
    }).factory('Sendmail', function($resource) {
        return $resource('http://www.openscience.or.at/ajax/sendMailSolobooking.php', {}, {
            send: {
                method: 'POST'
            }
        });
    });
