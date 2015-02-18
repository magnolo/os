'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:BookingsCtrl
 * @description
 * # BookingsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('BookingsCtrl', function($scope, $state, $modal, FlashService, Events) {
        $scope.bookings = Events.bookings();
        $scope.deleteTicket = function(ticket) {
            if (ticket.solo == 1) {
                if (confirm('Die Einzelbuchung von\n' + ticket.firstname + ' ' + ticket.lastname + '\nfür den Kurs\n' + ticket.class.title + '\nentgültig entfernen?')) {
                    Events.deleteTicket({
                        eventId: ticket.id,
                        type: 'solo'
                    }, function(data) {
                        if (data.status == true) {
                            $scope.bookings.splice($scope.bookings.indexOf(ticket), 1);
                            FlashService.show('Buchung erfolgreich entfernt!', '', 'success');
                        }
                    })
                }
            } else if (ticket.groups == 1) {
                if (confirm('Die Gruppenbuchung von\n' + ticket.firstname + ' ' + ticket.lastname + '\nfür den Kurs\n' + ticket.class.title + '\nentgültig entfernen?')) {
                    Events.deleteGroupEvent({
                        eventId: ticket.id,
                        type: 'group'
                    }, function(data) {
                        if (data.status == true) {
                            $scope.bookings.splice($scope.bookings.indexOf(ticket), 1);
                            FlashService.show('Buchung erfolgreich entfernt!', '', 'success');
                        }
                    })
                }
            }
        };
        $scope.showTicket = function(ticket) {
            if (ticket.solo == 1) {
                $state.go('event', {
                    id: ticket.event.id,
                    type: 'solo'
                });
            } else if (ticket.groups == 1) {
                $state.go('event', {
                    id: ticket.id,
                    type: 'group'
                });
            }
        }
    });
