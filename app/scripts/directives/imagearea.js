'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:imagearea
 * @description
 * # imagearea
 */
angular.module('osApp')
	.directive('imagearea', function($timeout) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$timeout(function() {
					scope.coords = {
						x1: 0,
						y1: 0,
						x2: 460,
						y2: 250,
					};
					if (scope.article.image.thumb_coords) {
						scope.coords = JSON.parse(scope.article.image.thumb_coords);
					}
					var ias = angular.element(element).imgAreaSelect({
						minWidth: 460,
						minHeight: 250,
						maxHeight: 250,
						handles: true,
						resizable: false,
						x1: scope.coords.x1,
						y1: scope.coords.xy,
						x2: scope.coords.x2,
						y2: scope.coords.y2,
						onSelectEnd: scope.setCrop,
						instance: true
					});
					scope.$watch('coords', function(c) {
						ias.setSelection(scope.coords.x1, scope.coords.y1, scope.coords.x2, scope.coords.y2);
						ias.update();
						//console.log(c);
					}, true);
				});
			}
		};
	});