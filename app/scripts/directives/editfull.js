'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:editfull
 * @description
 * # editfull
 */
angular.module('osApp')
	.directive('editfull', function() {
		return {
			templateUrl: 'views/directive/editfull.html',
			restrict: 'E',
			replace: true
		};
	});