'use strict';

angular.module('osApp')
	.controller('VolguestbookCtrl', function($scope, Guestbook) {
		$scope.entries = Guestbook.query({
			active: 1
		});
		$scope.captchaOptions = {
			imgPath: 'images/',
			captcha: {
				numberOfImages: 5,
				url: 'http://www.openscience.or.at/assets/lib/captcha/start.php'
			},
			language: {
				accessibilityAlt: 'Sound icon',
				accessibilityTitle: 'Accessibility option: listen to a question and answer it!',
				accessibilityDescription: 'Type below the <strong>answer</strong> to what you hear. Numbers or words:',
				explanation: 'Klicken Sie das Symbol: <strong>ANSWER</strong>',
				refreshAlt: 'Refresh/reload icon',
				refreshTitle: 'Refresh/reload: get new images and accessibility option!'
			},
			// use init callback to get captcha object
			init: function(captcha) {
				$scope.captcha = captcha;
			}
		};
	});