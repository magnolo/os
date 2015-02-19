'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('EventCtrl', function($scope, $state, $modal, FlashService, Events, Classes, FileUploader) {
        $scope.places = 0;
        $scope.ticket = {};
        $scope.images = [];
        $scope.image = {};
        $scope.classes = Classes.query();

        $scope.edit = {
            event: false,
            contact: false
        }
        $scope.event = Events.get({
            kind: 'event',
            eventId: $state.params.id,
            type: $state.params.type
        }, function(data) {
            $scope.event.type = $state.params.type;
            if ($state.params.type == 'closed') {
                $scope.event.full_day = parseInt($scope.event.full_day);
            }
            setDates();

        });
        $scope.toggleEventEdit = function() {
            if ($scope.edit.event) {
                $scope.edit.event = false;
            } else {
                $scope.edit.event = true;
            }
        };
        $scope.toggleContactEdit = function() {
            if ($scope.edit.contact) {
                $scope.edit.contact = false;
            } else {
                $scope.edit.contact = true;
            }
        };

        function setDates(starting) {
            if (typeof starting == "undefined") {
                if ($scope.event.groups == 1) {
                    $scope.event.start = $scope.event.date_confirmed;
                    $scope.event.end = moment($scope.event.date_confirmed, 'YYYY-MM-DD HH:mm:ss').add($scope.event.class.duration, 'hours');
                } else if ($scope.event.solo == 1) {
                    $scope.event.start = $scope.event.date_start;
                    $scope.event.end = moment($scope.event.date_start, 'YYYY-MM-DD HH:mm:ss').add($scope.event.class.duration, 'hours');
                    $scope.places = 0;

                    angular.forEach($scope.event.tickets.query, function(ticket) {
                        $scope.places += parseInt(ticket.places);
                    })
                } else if ($scope.event.type == 'closed') {
                    if ($scope.event.full_day == '1') {
                        $scope.event.start = moment($scope.event.date, 'YYYY-MM-DD HH:mm:ss').startOf('day').format('YYYY-MM-DD HH:mm:ss');
                        $scope.event.end = moment($scope.event.date, 'YYYY-MM-DD HH:mm:ss').endOf('day').format('YYYY-MM-DD HH:mm:ss');
                    } else {
                        $scope.event.start = $scope.event.date;
                        $scope.event.end = moment($scope.event.date, 'YYYY-MM-DD HH:mm:ss').add($scope.event.duration, 'hours');
                    }

                }
            } else {
                if ($scope.event.groups == 1) {
                    $scope.event.date_confirmed = starting;
                    $scope.event.end = moment($scope.event.date_confirmed, 'YYYY-MM-DD HH:mm:ss').add($scope.event.class.duration, 'hours');
                } else if ($scope.event.solo == 1) {
                    $scope.event.date_start = starting;
                    $scope.event.end = moment($scope.event.date_start, 'YYYY-MM-DD HH:mm:ss').add($scope.event.class.duration, 'hours');
                } else if ($scope.event.type == 'closed') {
                    if ($scope.event.full_day) {
                        $scope.event.date = starting;
                        $scope.event.end = moment($scope.event.date, 'YYYY-MM-DD HH:mm:ss').endOf('day');
                    } else {
                        $scope.event.date = starting;
                        $scope.event.end = moment($scope.event.date, 'YYYY-MM-DD HH:mm:ss').add($scope.event.duration, 'hours');
                    }
                }
            }

        };
        $scope.$watchCollection('event', function(item, oldItem) {
            if (item == oldItem || typeof oldItem == "undefined" || typeof oldItem.id == "undefined") {
                return;
            }
            if (item.start != oldItem.start || item.labor_id != oldItem.labor_id) {
                setDates(item.start);

                if (item.type == 'closed') {
                    if (item.full_day) {
                        var s = moment(item.start, 'YYYY-MM-DD HH:mm:ss').startOf('day').valueOf() / 1000;
                        var e = moment(item.start, 'YYYY-MM-DD HH:mm:ss').endOf('day').valueOf() / 1000;
                    } else {
                        var s = moment(item.start, 'YYYY-MM-DD HH:mm:ss').subtract(5, 'minutes').valueOf() / 1000;
                        var e = moment(item.start, 'YYYY-MM-DD HH:mm:ss').add($scope.event.duration, 'hours').add(5, 'minutes').valueOf() / 1000;
                    }

                } else {
                    var s = moment(item.start, 'YYYY-MM-DD HH:mm:ss').subtract(5, 'minutes').valueOf() / 1000;
                    var e = moment(item.start, 'YYYY-MM-DD HH:mm:ss').add($scope.event.class.duration, 'hours').add(5, 'minutes').valueOf() / 1000;
                }

                Events.check({
                    start: s,
                    end: e,
                    labor_id: item.labor_id,
                    event_id: item.id,
                    type: $state.params.type
                }, function(data) {
                    if (data.match > 0) {
                        $scope.dateError = true;
                    } else {
                        $scope.dateError = false;
                    }
                });
            }
            if (item.class_id != oldItem.class_id) {
                angular.forEach($scope.classes, function(c) {
                    if (c.id == $scope.event.class_id) {
                        $scope.event.class = c;
                    }
                });
                setDates();
            }
            if (item.labor_id != oldItem.labor_id) {
                var places = 20;
                if (item.labor_id == 2) {
                    places = 30;
                } else if (item.labor_id == 1) {
                    places = 20;
                }
                item.labor.places = places;
                setDates();
            }
        });
        $scope.$watchCollection('ticket', function(item, oldItem) {
            if (item.places == oldItem.places) {
                return;
            } else {
                if (item.places > ($scope.event.labor.places - $scope.places)) {
                    item.places = $scope.event.labor.places - $scope.places;
                    FlashService.show('Nicht genügend Plätze vorhanden', 'Es sind maximal ' + ($scope.event.labor.places - $scope.places) + ' Plätze verfügbar', 'danger');
                }
                if (item.places < 1) {
                    item.places = 1;
                }

            }
        });
        $scope.calcPlaces = function() {
            if ($scope.event.solo == 1) {
                $scope.places = 0;
                angular.forEach($scope.event.tickets.query, function(ticket) {
                    $scope.places += parseInt(ticket.places);
                })
            }
        };
        $scope.inFuture = function() {
            var s = moment();
            var now = moment();
            if ($scope.event.groups == 1) {
                s = moment($scope.event.date_confirmed, 'YYYY-MM-DD HH:mm:ss');

            } else if ($scope.event.solo == 1) {
                s = moment($scope.event.date_start, 'YYYY-MM-DD HH:mm:ss');
            } else if ($scope.event.type == 'closed') {
                s = moment($scope.event.date, 'YYYY-MM-DD HH:mm:ss');
            }
            if (s.isBefore(now)) {
                return false;
            } else {
                return true;
            }
        };
        $scope.showTicket = function(ticket) {
            $scope.ticket = ticket;
            console.log(ticket);
            $scope.ticket.places = parseInt($scope.ticket.places);
            $scope.ticketModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/ticket.html',
                show: false
            });
            $scope.ticketModal.$promise.then(function() {
                $scope.ticketModal.show();
            });
        };
        $scope.addTicket = function() {
            $scope.ticket = {};
            $scope.ticket.places = 1;
            $scope.ticketModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/ticket.html',
                show: false
            });
            $scope.ticketModal.$promise.then(function() {
                $scope.ticketModal.show();
            });
        };
        $scope.saveTicket = function(isValid) {
            if (isValid) {

                if ($scope.ticket.id) {
                    $scope.ticket.event_id = $scope.event.id;
                    $scope.ticket.labor_id = $scope.event.labor_id;
                    $scope.ticket.solo = 1;
                    Events.updateTicket({
                        eventId: $scope.ticket.id
                    }, $scope.ticket, function(data) {
                        if (data.status == true) {
                            $scope.ticketModal.hide();
                            $scope.calcPlaces();
                            FlashService.show('Buchung erfolgreich gespeichert', '', 'success');
                        }
                    });
                } else {
                    $scope.ticket.event_id = $scope.event.id;
                    $scope.ticket.labor_id = $scope.event.labor_id;
                    $scope.ticket.solo = 1;
                    Events.createTicket($scope.ticket, function(data) {
                        if (data.status == true) {
                            $scope.ticket.id = data.event.id;
                            $scope.event.tickets.query.push(data.event);
                            $scope.ticketModal.hide();
                            $scope.calcPlaces();
                            FlashService.show('Buchung erfolgreich gespeichert', '', 'success');
                        }
                    });
                }

            }
        };
        $scope.deleteTicket = function(ticket) {
            if (confirm('#' + ticket.id + '\nTeilnehmer: ' + ticket.lastname + " " + ticket.firstname + '\nentgültig entfernen?')) {
                Events.deleteTicket({
                    eventId: ticket.id
                }, function(data) {
                    if (data.status == true) {
                        $scope.ticketModal.hide();
                        $scope.event.tickets.query.splice($scope.event.tickets.query.indexOf(ticket), 1);
                        FlashService.show('Teilnehmer erfolgreich entfernt!', '', 'success');
                        $scope.calcPlaces();
                    }
                })
            }
        };
        $scope.saveEvent = function() {
            if ($scope.event.type == 'closed') {
                if ($scope.event.full_day) {
                    $scope.event.duration = 24;
                    $scope.event.start = moment($scope.event.start).startOf('day');
                    $scope.event.end = moment($scope.event.start).endOf('day');
                } else {
                    $scope.event.duration = moment($scope.event.end).diff(moment($scope.event.start), 'hours', true);
                }

            }
            Events.update({
                eventId: $scope.event.id,
                type: $state.params.type
            }, $scope.event, function(data) {
                if (data.status == true) {
                    FlashService.show(data.message, '', 'success');
                    $scope.edit.event = false;
                    $scope.edit.contact = false;
                }
            });

        };
        $scope.sortController = {
            orderChanged: function(event) {
                var list = [];
                angular.forEach($scope.event.images, function(image) {
                    list.push(image.id);
                });
                console.log(list);
                Events.sortimages({
                    eventId: $scope.event.id
                }, {
                    list: list,
                    type: $state.params.type
                }, function(response) {
                    if (response.status == false) {
                        FlashService.show('Fehlgeschlagen', '', 'danger');
                    } else {

                        FlashService.show(response.message, '', 'success');
                    }
                });
            }
        };
        $scope.openImagesModal = function(multiple) {
            uploader.clearQueue();
            $scope.images = [];
            $scope.image = {};
            $scope.uploadMultiple = multiple;
            if (!multiple) {
                uploader.queueLimit = 1;
                $scope.image.id = 0;
            } else {
                uploader.queueLimit = 20;
            }
            $scope.uploadImagesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/uploadImages.html',
                show: false
            });
            $scope.uploadImagesModal.$promise.then($scope.uploadImagesModal.show);
        };
        $scope.addImages = function(isValid) {
            if ($scope.uploadMultiple) {
                if ($scope.event.images == null) {
                    $scope.event.images = [];
                }
                angular.forEach($scope.images, function(image) {
                    Events.addImage({

                        eventId: $scope.event.id
                    }, {
                        type: $state.params.type,
                        imageId: image.id,
                    }, function(data) {
                        if (data.status == true) {
                            $scope.event.images.push(image);
                            FlashService.show(data.message, '', 'success');
                        } else {
                            FlashService.show('Fehler beim hinzufügen des Bildes!', '', 'danger');
                        }

                    });

                });
                $scope.images = [];
            } else {
                $scope.event.image = $scope.image;
                $scope.event.image_id = $scope.image.id;
                $scope.image = {};
            }
            $scope.uploadImagesModal.hide();
        };
        $scope.removeImage = function(image) {
            Events.removeImage({
                eventId: $scope.event.id,
                actionKind: image.id,
                type: $state.params.type
            }, function(response) {
                if (response.status == true) {
                    $scope.event.images.splice($scope.event.images.indexOf(image), 1);
                }
            });
        };
        /*$scope.saveImageData = function(isValid) {
            if (isValid) {
                ImageEdit.update({
                    imageId: $scope.article.image.id
                }, {
                    title: $scope.article.image.title,
                    thumb_coords: $scope.article.image.thumb_coords,
                    source: $scope.article.image.source
                }, function(response) {
                    if (response.status == true) {
                        $scope.hideCropping();
                    }
                });
            }
        };*/
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://www.openscience.or.at/assets/ajax/uploadImages.php',
            alias: 'qqfile',
            queueLimit: 20
        });
        uploader.formData = [{
            cat: 'events',
            id: 'new'
        }];
        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            uploader.formData[0].id = $scope.event.id;
            fileItem.formData[0].id = $scope.event.id;

        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if ($scope.uploadMultiple) {
                $scope.images.push(response.image);
            } else {
                $scope.image = response.image;
            }

        };
    });
