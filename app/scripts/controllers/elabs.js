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
    });
