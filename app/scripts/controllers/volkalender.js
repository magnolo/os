/*global moment */
'use strict';

angular.module('osApp')
	.controller('VolkalenderCtrl', function ($scope, $state, Events, Classes, $modal) {
		$scope.events = [];
    $scope.courses = [];
    $scope.user = {
      selectedCourse: null,
      selectedPlaces: 0
    };
		$scope.specialDates = [];
		if ($state.params.lab && $state.params.date) {
			$scope.selectedLab = $state.params.lab;
			$scope.selectedDate = moment($state.params.date, 'DD-MM-YYYY').toDate();
		} else {
			$scope.selectedDate = new Date();
      $scope.selectedLab = 1;
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
          $scope.gap = 0;
          var space = 120;
					d.set('hour', 9).set('minute', 30);
					angular.forEach(data, function (date) {
						//date.cssClass = 'calendarEventSolo_before';
						date.date = new Date(date.start * 1000);
						if (d.weekday() != 6 && d.weekday() != 7 && d.isAfter(moment())) {
							var start = moment(date.date);
							var diff = start.diff(d, 'minutes');
							if (diff >= space) {
                if(d.hour() > 9){
                  d.add(30, 'minutes');
                }
                $scope.gap = Math.max($scope.gap, start.subtract(30, 'minutes').diff(d, 'minutes'));
								if($scope.gap >= space){
									$scope.eventList.push({
										date_start: d,
										type: 'register',
	                  start: d.unix(),
										fullDay: false
									});
								}
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
					if (d.weekday() != 5 && d.weekday() != 6 && d.isAfter(moment())) {
						var end = moment(date).set('hour', 18);
						if (end.diff(d, 'minutes') >= space) {
              if(d.hour() > 9){
                d.add(30, 'minutes');
              }
              var registerEvent = {
								date_start: d,
								type: 'register',
                start: d.unix()
							};

              $scope.gap = Math.max($scope.gap, end.diff(d, 'minutes'));
              if($scope.eventList.length == 0){
								registerEvent.fullDay = true;
                registerEvent.title =  'Labor ganztags frei';
              }
							$scope.eventList.push(registerEvent);
						}
					}

				});
        $scope.preBooking = function(date){
          $scope.ev = date;

          if($scope.courses.length == 0){
            $scope.courses = Classes.query({
        			active: 1,
        			order: 'title',
        			kurse: 1
        		});
          }
          $scope.prebookModal = $modal({
              scope: $scope,
              template: 'views/modal/prebooking.html',
              show: false
          });
          $scope.prebookModal.$promise.then($scope.prebookModal.show);
        };
        $scope.prebook = function(){
          console.log($scope.user);
           $scope.prebookModal.hide();
           $state.go('vol.gruppenbuchung.kurs.date.places',{
             kurs:$scope.user.selectedCourse.name,
             date:moment($scope.ev.date_start).unix(),
             places:$scope.user.selectedPlaces
           });

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
