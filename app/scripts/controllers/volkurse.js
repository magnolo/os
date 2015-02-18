'use strict';

angular.module('osApp')
	.controller('VolkurseCtrl', function($scope, $rootScope, $document, $timeout, $state, Classes) {
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
						$document.scrollToElement(article, 70);
						$rootScope.isLoading = false;
					}, 200);

				});
			} else {
				$rootScope.isLoading = false;
			}

		});
		$scope.$watch('selectedDate', function(data) {
			console.log(data);
		});
	});