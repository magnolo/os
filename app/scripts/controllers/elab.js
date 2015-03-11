'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:ElabCtrl
 * @description
 * # ElabCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('ElabCtrl', function($stateParams, $scope, $modal, FlashService, Elab) {
        $scope.elab = Elab.section({
            id: $stateParams.id
        });
        $scope.elabs = Elab.sectionLabs({
            type: $stateParams.id
        });
    });
