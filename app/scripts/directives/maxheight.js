'use strict';

/*angular.module('osApp')
	.directive('maxheight', function($document, $timeout) {
		return {
			restrict: 'A',
			scope: {
				items: '='
			},
			link: function postLink(scope, elem, attrs) {
				scope.$watch('items', function(val) {

					var bodyHeight = $(window).height();
					var height = elem.children()[0].offsetHeight;
					var offset = elem.position().top;

					if ((height + offset + 104) > bodyHeight) {
						elem.css('height', (bodyHeight - offset - 104) + 'px');
					}
					var frame = angular.element(elem);
					var wrap = frame.parent();

					/*frame.sly({
						speed: 300,
						//easing: 'easeOutExpo',
						//pagesBar: $wrap.find('.pages'),
						//activatePageOn: 'click',
						scrollBar: wrap.find('.scrollbar'),
						scrollBy: 100,
						dragHandle: 0,
						dynamicHandle: 1,
						mouseDragging: 1,
						touchDragging: 1,
						clickBar: 1
					}, {
						load: function(sdfs) {
							console.log(sdfs);
						}
					});
				});
			}
		};
	});*/