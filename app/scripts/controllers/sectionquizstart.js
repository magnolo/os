'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:SectionquizstartCtrl
 * @description
 * # SectionquizstartCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('SectionquizstartCtrl', function($scope, $stateParams, Quiz) {
        $scope.q = {};
        $scope.position = 0;
        $scope.startet = false;
        $scope.$parent.quiz.$promise.then(function() {
            angular.forEach($scope.$parent.quiz, function(quiz, index) {
                if (quiz.name == $stateParams.name) {
                    $scope.q = quiz;

                }
            });
        });
        $scope.startQuiz = function() {
            $scope.startet = true;
            $scope.position = 1;
        };
        $scope.changeQuestion = function(value) {
            $scope.position += value;
        }
    });