'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:mfp
 * @description
 * # mfp
 */
angular.module('osApp')
	.directive('mfp', function() {
		return {
			restrict: 'A',
			link: function maginificPopupDirective(scope, element, attrs) {
				element.magnificPopup({
					type: 'image',
					delegate: 'a',
					gallery: {
						enabled: true,
						tPrev: 'Zurück (Link Pfeiltaste)', // title for left button
						tNext: 'Weiter (Rechte Pfeiltaste)', // title for right button
						tCounter: '<span class="mfp-counter">%curr% von %total%</span>' // markup of counter
					},
					mainClass: 'mfp-with-zoom', // this class is for CSS animation below

					zoom: {
						enabled: true, // By default it's false, so don't forget to enable it
						duration: 300, // duration of the effect, in milliseconds
						easing: 'ease-in-out', // CSS transition easing function 
					}
				});
			}
		};
	});