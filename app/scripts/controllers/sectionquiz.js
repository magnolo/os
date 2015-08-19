'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:SectionquizCtrl
 * @description
 * # SectionquizCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('SectionquizCtrl', function($scope, $stateParams, Quiz) {
        $scope.section = $stateParams.section || 'vol';
    });
