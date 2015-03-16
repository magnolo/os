'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:ElabsCtrl
 * @description
 * # ElabsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('ElabsCtrl', function($scope, $modal, FlashService, Elab) {
        $scope.sections = Elab.sections();
        $scope.deleteElab = function(elab) {
            if (confirm('eLab :\n' + elab.title + '\nentgültig entfernen?')) {
                Elab.remove({
                    id: elab.id
                }, function(data) {
                    if (data.status == true) {
                        $scope.sections.splice($scope.sections.indexOf(elab), 1);
                        FlashService.show(data.message, '', 'success');
                    } else {
                        FlashService.show('Löschen fehlgeschlagen!', '', 'danger');
                    }
                })
            }
        };
        $scope.setOnline = function(section, value) {
            Elab.update({
                id: section.id
            }, {
                online: value
            }, function(data) {
                if (data.status == true) {
                    section.online = value;
                    FlashService.show(data.message, '', 'success');
                } else {
                    FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                }
            })
        };
    });