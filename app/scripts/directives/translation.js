'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:translation
 * @description
 * # translation
 */
angular.module('osApp')
	.directive('translationtext', function($translate) {
		return {
			restrict: 'A',
			require: 'ngModel',
			replace: true,
			template: '<div ng-bind-html="text"></div>',
			link: function postLink(scope, element, attrs, ngModel) {
				scope.text = ngModel.text;
				console.log(ngModel);
			}
		};
	}).directive('translationTitle', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function postLink(scope, element, attrs, ngModel) {

			}
		};
	});