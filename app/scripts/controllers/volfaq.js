'use strict';

angular.module('osApp')
	.controller('VolfaqCtrl', function($scope, Faq) {
		$scope.faqs = Faq.query({
			section: 'vol',
			online: 1
		});
		$scope.switch = function(faq) {
			if (faq.show) {
				faq.show = false;
			} else {
				faq.show = true;
			}

		};
	});