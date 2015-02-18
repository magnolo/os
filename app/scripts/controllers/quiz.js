'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:QuizCtrl
 * @description
 * # QuizCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('QuizCtrl', function($scope, Quiz, FlashService) {
		$scope.quizes = Quiz.query();
		$scope.types = [{
			id: "1",
			name: 'Quiz'
		}, {
			id: "2",
			name: 'Umfrage'
		}];
	});