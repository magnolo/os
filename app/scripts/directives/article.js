'use strict';

angular.module('osApp')
	.directive('article', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/directive/article.html'
		};
	});