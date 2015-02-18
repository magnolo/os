'use strict';

angular.module('osApp')
	.controller('VolgruppenbuchungCtrl', function($scope, $state, $document, $timeout, Classes) {
		$scope.site = true;
		$scope.dates = [];
		$scope.files = [];
		$scope.direct = true;
		$scope.selectedPlaces = 0;
		$scope.selectedDate = {};
		$scope.selectedClass = {};
		$scope.loading = {
			dates: false
		};
		$scope.classes = Classes.query({
			type: 'groups',
			active: 1
		}, function(data) {
			if ($state.params.kurs) {
				angular.forEach(data, function(cl) {
					if ($state.params.kurs === cl.title) {
						$scope.selectedClass = cl;
						$scope.direct = false;
					}
				});
			}
		});
		$scope.$watch('selectedClass', function(course) {
			$scope.selectedPlaces = 0;
			$timeout(function() {
				var marker = angular.element(document.getElementById('choose_places'));
				$document.scrollToElement(marker, 0, 100);
			});
		});
		$scope.$watch('selectedPlaces', function(places) {
			if (places = 0) {
				return;
			}
			$timeout(function() {
				var marker = angular.element(document.getElementById('choose_date'));
				$document.scrollToElement(marker, 0, 100);
			});
		});
		$scope.$watch('selectedSecond', function(date) {
			if (typeof date === 'undefined') {
				return;
			}
			$timeout(function() {
				var marker = angular.element(document.getElementById('fill_form'));
				$document.scrollToElement(marker, 0, 100);
			});
		});
		$scope.deleteDate = function(pos) {
			if (pos == 0) {
				$scope.selectedDate = [];
				delete $scope.selectedFirstDate;
			} else if (pos == 1) {
				$scope.selectedSecond = [];
				delete $scope.selectedSecondDate;
			}
		};
	});