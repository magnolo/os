'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:startup
 * @description
 * # startup
 */
angular.module('osApp')
	.directive('startup', function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				element.removeClass('waiting-for-angular');
			}
		};
	});