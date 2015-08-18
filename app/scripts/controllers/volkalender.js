/*global moment */
'use strict';

angular.module('osApp')
	.controller('VolkalenderCtrl', function ($scope, $state, Events, Classes, $modal) {
		$scope.events = [];
    $scope.courses = [];
		$scope.specialDates = [];
		if ($state.params.lab && $state.params.date) {
			$scope.selectedLab = $state.params.lab;
			$scope.selectedDate = moment($state.params.date, 'DD-MM-YYYY').toDate();
		} else {
			$scope.selectedDate = new Date();
		}
		$scope.kurse = [];

		$scope.$watch('selectedDate', function (date) {
			//if ($scope.selected) {
			if (typeof date !== 'undefined') {
				$scope.kurse = [];
				$scope.eventList = Events.query({
					kind: 'day',
					start: date.getTime() / 1000,
					end: (date.getTime() / 1000) + 86400,
					text: 1,
					free: 1,
					labor: $scope.selectedLab
				}, function (data) {

					var d = moment(date);
					d.set('hour', 9).set('minute', 30);
					angular.forEach(data, function (date) {
						//date.cssClass = 'calendarEventSolo_before';
						date.date = new Date(date.start * 1000);
						if (d.weekday() != 6 && d.weekday() != 7) {
							var start = moment(date.date);
							var diff = start.diff(d, 'minutes');
							if (diff >= 150) {
                if(d.hour() > 9){
                  d.add(30, 'minutes');
                }
								$scope.eventList.push({
									date_start: d,
									type: 'register',
                  start: d.unix()
								});
							}
						}
						d = moment(new Date(date.end * 1000));
						//$scope.specialDates.push(date);
						if (typeof date.class !== 'undefined') {
							$scope.kurse.push(Classes.class({
								classId: date.class.id
							}));
						}
					});
					if (d.weekday() != 6 && d.weekday() != 7) {
						var end = moment(date).set('hour', 18);
						if (end.diff(d, 'minutes') >= 150) {
              if(d.hour() > 9){
                d.add(30, 'minutes');
              }
              var registerEvent = {
								date_start: d,
								type: 'register',
                start: d.unix()
							};
              if($scope.eventList.length == 0){
                registerEvent.title =  'Labor ganztags frei';
              }
							$scope.eventList.push(registerEvent);
						}
					}

				});
        $scope.preBooking = function(date){
          $scope.ev = date;       

          if($scope.courses.length == 0){
            $scope.courses = Classes.query();
          }
          $scope.prebookModal = $modal({
              scope: $scope,
              template: 'views/modal/prebooking.html',
              show: false
          });
          $scope.prebookModal.$promise.then($scope.prebookModal.show);
        };
				/*$scope.events.solo = Events.query({
					kind: 'events',
					start: date.getTime() / 1000,
					end: (date.getTime() / 1000) + 86400,
					text: 1,
					labor: $scope.selectedLab
				}, function(data) {
					angular.forEach(data, function(date) {
						$scope.eventList.push(date);
						$scope.kurse.push(Classes.class({
							classId: date.class.id
						}));
					});
				});
				$scope.events.group = Events.query({
					kind: 'groupevents',
					start: date.getTime() / 1000,
					end: (date.getTime() / 1000) + 86400,
					text: 1,
					free: 1,
					labor: $scope.selectedLab
				}, function(data) {
					angular.forEach(data, function(date) {
						$scope.eventList.push(date);
						$scope.kurse.push(Classes.class({
							classId: date.class.id
						}));
					});
				});
				$scope.events.closed = Events.query({
					kind: 'closed',
					start: date.getTime() / 1000,
					end: (date.getTime() / 1000) + 86400,
					text: 1,
					free: 1,
					labor: $scope.selectedLab
				}, function(data) {
					angular.forEach(data, function(date) {
						$scope.eventList.push(date);
					})
				});*/
			}
			// }

		});
		/*$scope.$watch('kurse', function (kurs) {
			console.log(kurs);
		});*/
	});
