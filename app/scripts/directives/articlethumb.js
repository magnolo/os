'use strict';

angular.module('osApp')
	.directive('articlethumb', function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/directive/articles.html',
			link: function(scope) {
				scope.colors = {
					'wissen': '523C7C',
					'schulcorner': '858D1E',
					'projekte': '1DA9C7',
					'vol': 'A31031'
				};
			}
		};
	})
	.directive('classthumb', function() {
		return {
			restrict: 'E',
			scope: {
				articles: '=',
				color: '='
			},
			replace: true,
			templateUrl: 'views/directive/classes.html'
		};
	});