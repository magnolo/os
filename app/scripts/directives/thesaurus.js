'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:thesaurus
 * @description
 * # thesaurus
 */
angular.module('osApp')
	.directive('thesaurus', function($timeout) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$timeout(function() {
					element.Thesaurus({
						caseSensitive: false,
						effect: 'fade'
					});
				});

			}
		};
	});