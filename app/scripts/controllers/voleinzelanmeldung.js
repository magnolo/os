/*jshint camelcase: false */
'use strict';

angular.module('osApp')
	.controller('VoleinzelanmeldungCtrl', function($scope, $timeout, $document, $location, $state, Classes, Events, Email, Article) {
		$scope.dates = [];
		$scope.files = [];
		$scope.direct = true;
		$scope.formLoading = false;
		$scope.bookingSuccess = false;
		$scope.bookingError = false;
		$scope.selectedPlaces = "";
		$scope.selectedDate = "";
		$scope.customer = {
			firstname: '',
			lastname: '',
			email: ''
		};
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
		$scope.limitBooks = function(places){
			return places > 5 ? 5 : places;
		};
		$scope.$watch('selectedClass', function(item, old) {
			if (item === old) {
				return;
			}
			if (typeof item !== 'undefined') {
				$scope.dates = [];
				$scope.files = [];
				$scope.selectedPlaces = "";
				$scope.selectedDate = "";
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
					if(marker.length){

						$document.scrollToElement(marker, 0, 100);
					}
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
		$scope.fillTestData = function () {
			$scope.customer.firstname = "Test";
			$scope.customer.lastname = "Test";
			$scope.customer.email = "test@test.com";
			$scope.customer.phone = "01 555 111";
		};
		$scope.sendAnmeldung = function(isValid) {
			if (isValid) {
				var data = {
					event_id: $scope.selectedDate.event_id,
					places: $scope.selectedPlaces,
					customer: $scope.customer
				};
				console.log(data);
			//	Email.regmail(data, function() {});
			}
			if (isValid) {
				$timeout(function () {
					var marker = angular.element(document.getElementById('response_message'));
					$document.scrollToElement(marker, 0, 100);
				});
				$scope.formLoading = true;
				$scope.bookingSuccess = false;
				$scope.bookingError = false;
				Events.createTicket({
					event_id: $scope.selectedDate.event_id,
					labor_id: 1,
					firstname: $scope.customer.firstname,
					lastname: $scope.customer.lastname,
					street: $scope.customer.street,
					zip: $scope.customer.zip,
					city: $scope.customer.city,
					email: $scope.customer.email,
					phone: $scope.customer.phone,
					text: $scope.customer.text,
					places: $scope.selectedPlaces,
					solo: 1,
					groups: 0,
					confirmed: '0'
				}, function (data) {

					if (data.status == true) {
						Email.regmail({
							id:data.id
						},{},function(response){
							$scope.bookingSuccess = true;
							$scope.formLoading = false;
							$timeout(function () {
								var marker = angular.element(document.getElementById('response_message'));
								$document.scrollToElement(marker, 0, 100);
							});
						});
					}
					else{
						$scope.bookingError = true;
						$scope.contact = Article.get({
							articleId: 584
						});
						$timeout(function () {
							var marker = angular.element(document.getElementById('response_message'));
							$document.scrollToElement(marker, 0, 100);
						});
					}

				});
			}
		};

	});
