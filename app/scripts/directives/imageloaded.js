'use strict';

angular.module('osApp')
	.directive('imageloaded', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element) {
				element.bind('load', function() {

					var parent = element.parent();
					element.css({
						'margin-top': (((element.innerHeight() - 250) / 2) * -1)
					});
					parent.hoverIntent({
						over: function() {
							if (!parent.hasClass('editing')) {

								parent.css({
									'height': element.innerHeight()
								});
								element.css({
									'margin-top': 0
								});

							}
						},
						out: function() {
							if (!parent.hasClass('editing')) {
								element.css({
									'margin-top': (((element.innerHeight() - 250) / 2) * -1)
								});
								parent.css({
									'height': 250
								});
							}
						},
						timeout: 350
					})
				});
			}
		};
	});