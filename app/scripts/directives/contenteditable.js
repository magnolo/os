'use strict';

angular.module('osApp')
	.directive('contenteditable', function() {

		return {
			restrict: 'A', // only activate on element attribute
			require: '?ngModel', // get a hold of NgModelController
			link: function(scope, element, attrs, ngModel) {
				if (!ngModel) {
					return;
				} // do nothing if no ng-model
				var dirty = false;
				// Specify how UI should be updated
				ngModel.$render = function() {
					element.html(ngModel.$viewValue || '');
				};
				// Write data to the model
				function read() {

					if (dirty) {
						var html = element.text();
						// When we clear the content editable the browser leaves a <br> behind
						// If strip-br attribute is provided then we strip this out
						ngModel.$setViewValue(html);
					}
				}
				// Listen for change events to enable binding
				element.on('blur keyup change', function() {
					dirty = true;
					scope.$apply(read);
				});
				read(); // initialize


			}
		};
	});