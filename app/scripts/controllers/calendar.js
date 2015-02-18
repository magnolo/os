'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:CalendarCtrl
 * @description
 * # CalendarCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('CalendarCtrl', function($scope, $state, $timeout, $modal, $cookies, Classes, Events, FlashService) {
        var initDate = new Date();
        var stopFetching = false;
        if ($cookies.calendarDate && $cookies.calendarDate != "" && typeof $cookies.calendarDate != "undefined" && $cookies.calendarDate != "Invalid Date") {
            initDate = new Date($cookies.calendarDate);
        }
        $scope.activeLab = $cookies.activeLab || 1;
        $scope.classes = Classes.query();
        $scope.selectedClass = {};
        $scope.event = {};
        $scope.dateError = true;
        $scope.fetched = false;
        $scope.totalPlaces = new Array(20);
        $scope.totalPlaces30 = new Array(30);
        $scope.labor1_data = [{
            url: 'http://www.openscience.or.at/api/events'
        }, {
            url: 'http://www.openscience.or.at/api/groupevents'
        }, {
            url: 'http://www.openscience.or.at/api/groupevents?type=query'
        }, {
            url: 'http://www.openscience.or.at/api/closed'
        }];
        $scope.labor2_data = [{
            url: 'http://www.openscience.or.at/api/events?labor=2'
        }, {
            url: 'http://www.openscience.or.at/api/groupevents?labor=2'
        }, {
            url: 'http://www.openscience.or.at/api/groupevents?type=query&labor=2'
        }, {
            url: 'http://www.openscience.or.at/api/closed?labor=2'
        }];
        $scope.eventSource = $scope.labor1_data;
        $scope.eventModal = $modal({
            scope: $scope,
            template: 'views/admin/modal/event.html',
            show: false
        });

        $scope.$watch('event.class_id', function(item, old) {
            if (item == old || $scope.classes.length == 0) {
                return;
            }
            angular.forEach($scope.classes, function(c) {
                if ($scope.event.class_id == c.id) {
                    $scope.selectedClass = c;
                }
            });
            if ($scope.event.start) {
                $scope.event.end = moment($scope.event.start).add($scope.selectedClass.duration, 'hours');
            };
        });
        $scope.$watch('event.start', function(item, old) {
            if (item == old) {
                return;
            }
            if ($scope.event.start && $scope.event.class_id) {
                $scope.event.end = moment($scope.event.start).add($scope.selectedClass.duration, 'hours');
            };
        });
        $scope.showEventModal = function() {
            $scope.eventModal.$promise.then($scope.eventModal.show);
        };
        $scope.alertOnEventClick = function(date, jsEvent, view) {

            $scope.dateError = false;
            $scope.edit = false;
            $scope.event = date;
            if ($scope.event.type == 'group' && $scope.event.confirmed == '0') {
                $scope.edit = true;
            }
            $scope.showEventModal();
        };
        $scope.newEventDialog = function(date) {
            if (typeof date == "undefined") {
                date = Date();
            }
            $scope.edit = true;
            $scope.event = {};
            $scope.event.start = date;
            $scope.dateError = false;
            $scope.event.labor_id = $scope.activeLab;
            $scope.newEventModal = $modal({
                show: false,
                scope: $scope,
                template: 'views/admin/modal/newEvent.html'
            });
            $scope.newEventModal.$promise.then($scope.newEventModal.show);
        };
        $scope.$watchCollection('event', function(item, oldItem) {

            if (item == oldItem || item.id != oldItem.id || !$scope.edit) {
                return;
            } else if (item.type != oldItem.type || item.start != oldItem.start || item.end != oldItem.end || item.labor_id != oldItem.labor_id || item.date_confirmed != oldItem.date_confirmed) {
                if ($scope.event.class_id) {
                    angular.forEach($scope.classes, function(c) {
                        if (c.id == $scope.event.class_id) {
                            $scope.class = c;
                        }
                    })
                }

                if ($scope.event.type && $scope.event.class_id && $scope.event.start || $scope.event.type == 'closed' && $scope.event.start) {

                    var s = moment($scope.event.start).subtract(5, 'minutes').valueOf() / 1000;
                    if ($scope.event.type != 'closed') {
                        if ($scope.event.type == 'group' && $scope.event.confirmed == '0') {
                            if ($scope.event.date_confirmed == '0000-00-00 00:00:00') {
                                return;
                            }

                            var s = moment($scope.event.date_confirmed).subtract(5, 'minutes').valueOf() / 1000;
                            var e = moment($scope.event.date_confirmed).add($scope.event.class.duration, 'hours').add(5, 'minutes').valueOf() / 1000;

                        } else {
                            var e = moment($scope.event.start).add($scope.class.duration, 'hours').add(5, 'minutes').valueOf() / 1000;
                        }
                    } else {
                        var e = moment($scope.event.end).add(5, 'minutes').valueOf() / 1000;
                    }
                    Events.check({
                        start: s,
                        end: e,
                        labor_id: item.labor_id,
                    }, function(data) {
                        $scope.fetched = true;
                        if (data.match > 0) {
                            $scope.dateError = true;
                        } else {
                            $scope.dateError = false;
                        }
                    });
                }
            }
        });
        $scope.gotoEvent = function(event) {
            $state.go('event', {
                id: event.id,
                type: event.type
            });
        };
        $scope.createEvent = function(isValid) {
            if (isValid) {
                $scope.event.date_start = moment($scope.event.start).format('YYYY-MM-DD HH:mm:ss');
                $scope.event.date_end = moment($scope.event.end).format('YYYY-MM-DD HH:mm:ss');

                if ($scope.event.type == 'solo') {
                    Events.create($scope.event, function(data) {
                        if (data.status == true) {
                            FlashService.show(data.message, '', 'success');
                            $scope.volCalendar.fullCalendar('refetchEvents');
                            $scope.newEventModal.hide();
                        }
                    });
                } else if ($scope.event.type == 'group') {
                    Events.createTicket({
                        company: $scope.event.company,
                        class_id: $scope.event.class_id,
                        labor_id: $scope.event.labor_id,
                        firstname: $scope.event.firstname,
                        lastname: $scope.event.lastname,
                        street: $scope.event.street,
                        zip: $scope.event.zip,
                        city: $scope.event.city,
                        email: $scope.event.email,
                        phone: $scope.event.phone,
                        fax: $scope.event.fax,
                        text: $scope.event.text,
                        places: $scope.event.booked,
                        groups: 1,
                        date_first: $scope.event.start,
                        date_confirmed: $scope.event.start,
                        confirmed: '1'
                    }, function(data) {
                        if (data.status == true) {
                            FlashService.show(data.message, '', 'success');
                            $scope.volCalendar.fullCalendar('refetchEvents');
                            $scope.newEventModal.hide();
                        }
                    });
                } else if ($scope.event.type == 'closed') {
                    var duration = 0;
                    if ($scope.event.full_day) {
                        duration = 24;
                        $scope.event.date_start = moment($scope.event.date_start).startOf('day').format('YYYY-MM-DD HH:mm:ss');
                    } else {
                        duration = moment($scope.event.date_end).diff(moment($scope.event.date_start), 'hours', true);
                    }
                    Events.createClosed({
                        date: $scope.event.date_start,
                        full_day: $scope.event.full_day,
                        title: $scope.event.title,
                        text: $scope.event.text,
                        duration: duration
                    }, function(data) {
                        if (data.status == true) {
                            FlashService.show(data.message, '', 'success');
                            $scope.volCalendar.fullCalendar('refetchEvents');
                            $scope.newEventModal.hide();
                        }
                    });
                }


            }
        };
        $scope.uiConfig = {
            calendar: {
                axisFormat: 'H:mm',
                firstHour: 8,
                minTime: 8,
                maxTime: 22,
                weekends: true,
                weekNumbers: true,
                timeFormat: {
                    agenda: 'H:mm{ - H:mm}',
                    '': 'H:mm'
                },
                columnFormat: {
                    month: 'ddd',
                    week: 'ddd d.M',
                    day: 'dddd d.M'
                },
                titleFormat: {
                    month: 'MMMM yyyy',
                    week: "d[ yyyy] { '-' d [ MMM] MMMM yyyy}",
                    day: 'dddd, d MMMM , yyyy'
                },
                monthNames: ["J&auml;nner", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                allDayText: 'Ganztags',
                header: {
                    left: 'today prev,next month,agendaWeek,agendaDay',
                    center: 'title',
                    right: 'labor1,labor2'
                },
                buttonText: {
                    today: 'Heute',
                    month: 'Monat',
                    week: 'Woche',
                    day: 'Tag',
                    labor1: 'Labor 1',
                    labor2: 'Labor 2'
                },
                customButtons: {
                    labor1: function(ding) {
                        $scope.setEventSource(1);

                    },
                    labor2: function(ding) {
                        $scope.setEventSource(2);

                    }

                },
                firstDay: 1,
                editable: false,
                eventClick: $scope.alertOnEventClick,
                dayClick: function(date, jsEvent) {
                    $scope.volCalendar.fullCalendar('gotoDate', date);
                    var view = $scope.volCalendar.fullCalendar('getView').name;
                    if (view == "agendaWeek") {
                        $scope.volCalendar.fullCalendar('changeView', 'agendaDay');
                    } else if (view == "month") {
                        $scope.volCalendar.fullCalendar('changeView', 'agendaWeek');
                    } else if (view == "agendaDay") {
                        $scope.newEventDialog(date);
                    }

                },
                viewRender: function(view, element) {

                    $cookies.calendarView = view.name;
                    $cookies.calendarDate = view.start;
                    $cookies.activeLab = $scope.activeLab;
                    //$scope.volCalendar.fullCalendar('changeView', view.name);
                },
                defaultView: $cookies.calendarView || 'month',
                year: initDate.getFullYear(),
                month: initDate.getMonth(),
                date: initDate.getDate()

            }
        };

        $scope.setEventSource = function(labor) {
            // remove the event source.
            angular.forEach($scope.eventSource, function(source) {
                $scope.volCalendar.fullCalendar('removeEventSource', source);
            });

            // Create the new event source url
            if (labor == 1) {
                $scope.eventSource = $scope.labor1_data;
                $scope.activeLab = 1;
            } else {
                $scope.eventSource = $scope.labor2_data;
                $scope.activeLab = 2;
            }
            $cookies.activeLab = $scope.activeLab;
            angular.forEach($scope.eventSource, function(source) {
                $scope.volCalendar.fullCalendar('addEventSource', source);
            });
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };
        if ($state.params.action == "new") {
            $scope.newEventDialog(Date());
        };
        $scope.confirmDate = function(event) {

            Events.update({
                eventId: event.id,
                type: 'group'
            }, {
                date_confirmed: event.date_confirmed,
                confirmed: '1',
                labor_id: event.labor_id

            }, function(data) {
                if (data.status = true) {
                    $scope.edit = false;
                    event.start = moment(event.date_confirmed);
                    event.end = moment(event.data_confirmed).add(event.class.duration);
                    event.confirmed = 1;
                    FlashService.show(data.message, '', 'success');
                    $scope.volCalendar.fullCalendar('refetchEvents');
                    $scope.setEventSource(event.labor_id);

                }

            });
        };
        $scope.deleteEvent = function(event) {
            if (confirm('Termin: ' + moment(event.start).format('DD.MM.YYYY HH:mm') + '\nim Labor ' + event.labor_id + '\nentgültig entfernen?')) {
                if (event.type == 'solo') {
                    if (event.booked) {
                        if (!confirm('Es sind bereits Plätze verbucht.\nTermin trotzdem löschen?')) {
                            return false;
                        }
                    }
                    Events.update({
                        eventId: event.id,
                        type: event.type
                    }, {
                        is_deleted: 1
                    }, function(data) {
                        if (data.status == true) {
                            FlashService.show('Termin erfolgreich entfernt', '', 'success');
                            $scope.volCalendar.fullCalendar('removeEvents', event.id);
                            $scope.eventModal.hide();
                        }
                    });
                } else if (event.type == 'group') {
                    Events.deleteGroupEvent({
                        eventId: event.id
                    }, function(data) {
                        if (data.status == true) {
                            FlashService.show(data.message, '', 'success');
                            $scope.volCalendar.fullCalendar('removeEvents', event.id);
                            $scope.eventModal.hide();
                        }
                    });
                } else if (event.type == 'closed') {
                    Events.deleteClosedEvent({
                        eventId: event.id
                    }, function(data) {
                        if (data.status == true) {
                            FlashService.show(data.message, '', 'success');
                            $scope.volCalendar.fullCalendar('removeEvents', event.id);
                            $scope.eventModal.hide();
                        }
                    });
                }

            }
        };
    });
