'use strict';

angular.module('osApp')
	.directive('persons', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/directive/persons.html'
		};
	});