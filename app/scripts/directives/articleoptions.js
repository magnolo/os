'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:articleoptions
 * @description
 * # articleoptions
 */
angular.module('osApp')
	.directive('articleoptions', function() {
		return {
			template: 'views/directive/articleoptions.html',
			restrict: 'E',
			replace: true
		};
	});