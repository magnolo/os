'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:question
 * @description
 * # question
 */
angular.module('osApp')
	.directive('question', function() {
		return {
			template: '<div><input type="text" ng-model="question" /></div>',
			restrict: 'A',
			replace: false,
			link: function postLink(scope, element, attrs) {

			}
		};
	});