'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:captcha
 * @description
 * # captcha
 */
angular.module('osApp')
	.directive('captcha', function() {
		return {
			require: 'ngModel',
			link: function(scope, elem, attrs, ctrl) {
				ctrl.$parsers.unshift(checkCaptcha);
				scope.numCapOne = Math.floor(Math.random() * 10) + 1;
				scope.numCapTwo = Math.floor(Math.random() * 10) + 1;

				function checkCaptcha(viewValue) {
					if (Number(elem.val()) == (scope.numCapOne + scope.numCapTwo)) {
						ctrl.$setValidity('captcha', true);
					} else {
						ctrl.$setValidity('captcha', false);
					}
					return viewValue;
				}
			}
		};
	});