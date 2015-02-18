'use strict';

angular.module('osApp')
	.directive('loader', function() {
		return {
			restrict: 'E',
			templateUrl: 'views/directive/loader.html',
			replace: true,
			scope: {
				content: '=',
				section: '='
			}
		};
	});