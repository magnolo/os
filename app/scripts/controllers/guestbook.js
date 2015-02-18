'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:GuestbookCtrl
 * @description
 * # GuestbookCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('GuestbookCtrl', function($scope, $modal, FlashService, Guestbook) {
        $scope.guestbook = Guestbook.query();
        $scope.entry = {};
        $scope.toggleActive = function(entry) {
            var active = 0;
            if (entry.active == 0) {
                active = 1;
            }
            Guestbook.update({
                id: entry.id
            }, {
                active: active
            }, function(data) {
                if (data.status == true) {
                    FlashService.show(data.message, '', 'success');
                    entry.active = active;
                }
            });
        };
        $scope.deleteEntry = function(entry) {
            if (confirm('Eintrag #' + entry.id + ' entgültig entfernen?')) {
                Guestbook.remove({
                    id: entry.id
                }, function(data) {
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                        $scope.guestbook.splice($scope.guestbook.indexOf(entry), 1);
                    }
                });
            }
        };
        $scope.showEntry = function(entry) {
            $scope.entry = entry;
            $scope.gbModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/guestbook.html',
                show: false
            });
            $scope.gbModal.$promise.then($scope.gbModal.show);
        };
    });
