'use strict';

angular.module('osApp')
	.controller('VolgruppenbuchungCtrl', function ($scope, $state, $document, $timeout, Classes, Events) {
		$scope.site = true;
		$scope.dates = [];
		$scope.files = [];
		$scope.direct = true;
		$scope.selectedPlaces = 0;
		$scope.selectedDate = {};
		$scope.selectedClass = {};
		$scope.hours = {
			selectedHours: "",
			selectedSecondHours: ""
		};
		$scope.loading = {
			dates: false
		};
		$scope.customer = {
			firstname: '',
			lastname: '',
			company: '',
			email: ''
		};
		$scope.classes = Classes.query({
			type: 'groups',
			active: 1
		}, function (data) {
			if ($state.params.kurs) {
				angular.forEach(data, function (cl) {
					if ($state.params.kurs === cl.title) {
						$scope.selectedClass = cl;
						$scope.direct = false;
					}
				});
			}
		});
		$scope.$watch('selectedClass', function (course) {
			$scope.selectedPlaces = 0;
			$timeout(function () {
				var marker = angular.element(document.getElementById('choose_places'));
				$document.scrollToElement(marker, 0, 100);
			});
		});
		$scope.$watch('selectedPlaces', function (places) {
			if (places = 0) {
				return;
			}
			$timeout(function () {
				var marker = angular.element(document.getElementById('choose_date'));
				$document.scrollToElement(marker, 0, 100);
			});
		});
		$scope.$watch('selectedSecond', function (date) {
			if (typeof date === 'undefined') {
				return;
			}
			$timeout(function () {
				var marker = angular.element(document.getElementById('fill_form'));
				$document.scrollToElement(marker, 0, 100);
			});
		});
		$scope.deleteDate = function (pos) {
			if (pos == 0) {
				$scope.selectedDate = [];
				delete $scope.selectedFirstDate;
			} else if (pos == 1) {
				$scope.selectedSecond = [];
				delete $scope.selectedSecondDate;
			}
		};
		$scope.fillTestData = function () {
			$scope.customer.firstname = "Test";
			$scope.customer.lastname = "Test";
			$scope.customer.company = "Test-Institut";
			$scope.customer.email = "test@test.com";
		};
		$scope.sendAnmeldung = function (isValid) {
			if (isValid) {
				console.log($scope.customer);
				console.log($scope.selectedClass);
				console.log($scope.selectedPlaces);
				console.log($scope.selectedFirstDate);
				console.log($scope.hours.selectedHours);
				console.log($scope.selectedSecondDate);
				console.log($scope.hours.selectedSecondHours);


				Events.createTicket({
					company: $scope.customer.company,
					class_id: $scope.selectedClass.class_id,
					labor_id: 1,
					firstname: $scope.customer.firstname,
					lastname: $scope.customer.lastname,
					street: $scope.customer.street,
					zip: $scope.customer.zip,
					city: $scope.customer.city,
					email: $scope.customer.email,
					phone: $scope.customer.phone,
					fax: $scope.customer.fax,
					text: $scope.customer.text,
					places: $scope.selectedPlaces,
					groups: 1,
					date_first: $scope.selectedFirstDate + " " + $scope.hours.selectedHours,
					date_second: $scope.selectedSecondDate + " " + $scope.hours.selectedSecondHours,
					confirmed: '0'
				}, function (data) {
					if (data.status == true) {
						/*FlashService.show(data.message, '', 'success');
						$scope.volCalendar.fullCalendar('refetchEvents');
						$scope.newEventModal.hide();*/
					}
				});
			}
		};
	});
