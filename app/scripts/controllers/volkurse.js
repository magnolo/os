'use strict';

angular.module('osApp')
	.controller('VolkurseCtrl', function($scope, $rootScope, $document, $window,$timeout, $state, Classes) {

		$scope.register = true;
		$scope.kurse = Classes.query({
			active: 1,
			order: 'position',
			kurse: 1
		}, function() {
			$rootScope.isLoading = true;
			if (typeof $state.params.kurs !== 'undefined') {
				$timeout(function() {
					$timeout(function() {
						var article = angular.element(document.getElementById($state.params.kurs));
							$rootScope.isLoading = false;
							console.log(article);
							$document.scrollToElement(article,150);

					});
				});
			} else {
				$rootScope.isLoading = false;
			}
		});
		$scope.$watch('selectedDate', function(data) {
			//console.log(data);
		});
	});
