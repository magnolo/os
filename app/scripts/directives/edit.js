'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:edit
 * @description
 * # edit
 */
angular.module('osApp')
	.directive('edit', function() {
		return {
			templateUrl: 'views/directive/edit.html',
			restrict: 'E',
			replace: true,
			link: function(scope, elem, attr) {
				scope.noDelete = false;
				if (attr.nodelete == 'true') {
					scope.noDelete = true;
				}
			}
		};
	});