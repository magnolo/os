'use strict';

angular.module('osApp')
	.directive('redactor', function($timeout) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {

				var updateModel = function updateModel(value) {
						scope.$apply(function() {
							ngModel.$setViewValue(value);
						});
					},

					updateKeyup = function updateKeyup() {
						scope.$apply(function() {
							ngModel.$setViewValue(element.getCode());
						});
					},

					updateCommand = function updateCommand() {
						scope.$apply(function() {
							ngModel.$setViewValue(element.getCode());
						});
					},

					options = {
						changeCallback: updateModel,
						keyupCallback: updateKeyup,
						execCommandCallback: updateCommand
					},
					additionalOptions = attrs.redactor ?
					scope.$eval(attrs.redactor) : {},
					editor,
					_element = angular.element(element);

				angular.extend(options, additionalOptions);

				// put in timeout to avoid $digest collision.  call render() to
				// set the initial value.
				$timeout(function() {
					editor = _element.redactor(options);
					ngModel.$render();
				});

				ngModel.$render = function() {
					if (angular.isDefined(editor)) {
						$timeout(function() {

							_element.setCode(ngModel.$viewValue);
							//$_element.redactor('set', ngModel.$viewValue || '');
						});
					}
				};
			}
		};
	});