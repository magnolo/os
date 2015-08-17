'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:login
 * @description
 * # login
 */
angular.module('osApp')
	.directive('login', function($rootScope, $state) {
		return function(scope, element, attrs) {
			element.bind('contextmenu', function(event) {
				scope.$apply(function() {
					if (!$rootScope.isLoggedIn) {
						event.preventDefault();
						$state.go('login')
					}
				});
			});
		};
	});
