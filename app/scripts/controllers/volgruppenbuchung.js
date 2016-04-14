'use strict';

angular.module('osApp')
	.controller('VolgruppenbuchungCtrl', function ($scope, $state, $document, $timeout, Classes, Events, Article, Email) {
		$scope.site = true;
		$scope.formLoading = false;
		$scope.bookingSuccess = false;
		$scope.bookingError = false;
		$scope.dates = [];
		$scope.files = [];
		$scope.direct = true;
		$scope.selectedPlaces = "";
		$scope.selectedDate = "";
		$scope.selectedClass = "";
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
					if ($state.params.kurs === cl.name) {
						$scope.selectedClass = cl;
						$scope.direct = false;
					}
				});
			}
			if($state.params.places){
				$timeout(function(){
					$scope.selectedPlaces = parseInt($state.params.places);
				});
			}
			/*if($state.params.date){
				$timeout(function(){
					$scope.selectedFirstDate = moment.unix($state.params.date).format('DD.MM.YYYY');
				});
			}*/
		});
		$scope.$watch('selectedClass', function (course) {
			$scope.selectedPlaces = "";
			$scope.selectedDate = "";
			$scope.deleteDate(0);
			$scope.deleteDate(1);

			$timeout(function () {
				var marker = angular.element(document.getElementById('choose_places'));
				$document.scrollToElement(marker, 0, 100);
			});
		});
		$scope.$watch('selectedPlaces', function (places) {
			if (places == 0 || places == "") {
				return;
			}
			$scope.deleteDate(0);
			$scope.deleteDate(1);
			$scope.calOpen = true;
			$timeout(function () {
				$timeout(function(){
					var marker = angular.element(document.getElementById('choose_date'));
					$document.scrollToElement(marker, 0, 100);

				});
			});
		});
			$scope.$watch('selectedDate', function(n, o){

				if( typeof n.time == "undefined") return
					$scope.calOpen = false;
			});
		$scope.$watch('selectedSecond', function (date) {
			if (typeof date === 'undefined') {
				return;
			}
			$scope.calOpen = false;
			$timeout(function () {
				var marker = angular.element(document.getElementById('fill_form'));
				$document.scrollToElement(marker, 0, 100);
			});
		});
		$scope.deleteDate = function (pos) {
			if (pos == 0) {
				$scope.selectedDate = [];
				$scope.hours.selectedHours = "";
				delete $scope.selectedFirstDate;
			} else if (pos == 1) {
				$scope.selectedSecond = [];
				$scope.hours.selectedSecondHours = "";
				delete $scope.selectedSecondDate;
			}
		};
		$scope.fillTestData = function () {
			$scope.customer.firstname = "Test";
			$scope.customer.lastname = "Test";
			$scope.customer.company = "Test-Institut";
			$scope.customer.email = "test@test.com";
		};
		$scope.showCalendar = function(){
			return $scope.selectedClass.id && $scope.selectedPlaces && (!$scope.selectedFirstDate ||  !$scope.selectedSecondDate);
		};
		$scope.sendAnmeldung = function (isValid) {
			if (isValid) {
				$timeout(function () {
					var marker = angular.element(document.getElementById('response_message'));
					$document.scrollToElement(marker, 0, 100);
				});
				$scope.formLoading = true;
				$scope.bookingSuccess = false;
				$scope.bookingError = false;
				var data = {
					company: $scope.customer.company,
					class_id: $scope.selectedClass.id,
					labor_id: $scope.hours.selectedHours.lab,
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
					date_first: moment($scope.selectedFirstDate, 'DD.MM.YYYY').format('YYYY-MM-DD') + " " + $scope.hours.selectedHours.time,
					date_second: moment($scope.selectedSecondDate, 'DD.MM.YYYY').format('YYYY-MM-DD') + " " + $scope.hours.selectedSecondHours.time,
					confirmed: '0'
				};

				Events.createTicket(data, function (data) {
					if (data.status == true) {
						Email.regmail({
							id:data.id
						},{
							group:1
						},function(response){
							$scope.formLoading = false;
							$scope.bookingSuccess = true;
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
