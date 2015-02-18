'use strict';

angular.module('osApp')
    .controller('VolguestbookCtrl', function($scope, Guestbook) {
        $scope.gb = {};
        $scope.sent = false;
        $scope.entries = Guestbook.query({
            active: 1
        });
        $scope.newEntry = function(isValid) {
            $scope.message = "";
            if (isValid) {
                Guestbook.add($scope.gb, function(data) {
                    if (data.status == true) {
                        $scope.sent = true;
                        $scope.message = "Vielen lieben Dank. Der Eintrag wurde erfolgreich gespeichert!";
                    } else {
                        $scope.message = "Ups, da ist was schiefgelaufen!<br>Bitte versuchen Sie es nochmal";
                    }
                });
            }
        };
        /*$scope.captchaOptions = {
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
		};*/
    });
