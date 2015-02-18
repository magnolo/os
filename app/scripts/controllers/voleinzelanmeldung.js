/*jshint camelcase: false */
'use strict';

angular.module('osApp')
	.controller('VoleinzelanmeldungCtrl', function($scope, $timeout, $document, $location, $state, Classes, Sendmail) {
		$scope.dates = [];
		$scope.files = [];
		$scope.direct = true;
		$scope.selectedPlaces = 0;
		$scope.selectedDate = {};
		$scope.loading = {
			dates: false
		};
		$scope.classes = Classes.query({
			type: 'solo',
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
		$scope.$watch('selectedClass', function(item, old) {
			if (item === old) {
				return;
			}
			if (typeof item !== 'undefined') {
				$scope.dates = [];
				$scope.files = [];
				$scope.selectedPlaces = 0;
				$scope.selectedDate = {};
				$scope.loading.dates = true;
				$scope.dates = Classes.dates({
					classId: item.id
				}, function(data) {
					$scope.loading.dates = false;
					if ($state.params.date) {
						angular.forEach(data, function(d) {
							if (d.date_start === $state.params.date) {
								$scope.selectedDate = d;
								$scope.direct = false;
							}
						});
					}
				});
				$scope.files = Classes.files({
					classId: item.id
				});
				if ($scope.direct) {
					$location.path('/vol/einzelanmeldung/' + $scope.selectedClass.title);
				}
				$timeout(function() {
					var marker = angular.element(document.getElementById('choose_date'));
					$document.scrollToElement(marker, 0, 100);
				});

			}

		});
		$scope.$watch('selectedDate', function(item, old) {
			if (item === old) {
				return;
			}
			if (item) {
				if ($scope.direct && typeof $scope.selectedDate.date_start !== 'undefined') {
					$location.path('/vol/einzelanmeldung/' + $scope.selectedClass.title + '/' + $scope.selectedDate.date_start);
				}
				//$location.path('/vol/einzelanmeldung/' + $scope.selectedClass.title + '/' + item.event_id);
				$timeout(function() {
					var marker = angular.element(document.getElementById('choose_places'));
					$document.scrollToElement(marker, 0, 100);
					$scope.direct = true;
				});
			}

		});
		$scope.$watch('selectedPlaces', function(item, old) {
			if (item === old) {
				return;
			}
			if (item !== 0) {
				$timeout(function() {
					var marker = angular.element(document.getElementById('fill_form'));
					$document.scrollToElement(marker, 0, 100);

				});
			}

		});
		$scope.sendAnmeldung = function(isValid) {
			if (isValid) {
				var data = {
					event_id: $scope.selectedDate.event_id,
					places: $scope.selectedPlaces,
					customer: $scope.customer
				};
				Sendmail.send(data, function() {});
			}
		};

	});