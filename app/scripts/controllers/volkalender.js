/*global moment */
'use strict';

angular.module('osApp')
	.controller('VolkalenderCtrl', function($scope, $state, Events, Classes) {
		$scope.events = [];
		$scope.specialDates = [];
		if ($state.params.lab && $state.params.date) {
			$scope.selectedLab = $state.params.lab;
			$scope.selectedDate = moment($state.params.date, 'DD-MM-YYYY').toDate();
		} else {
			$scope.selectedDate = new Date();
		}
		$scope.kurse = [];

		$scope.$watch('selectedDate', function(date) {
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
				}, function(data) {
					angular.forEach(data, function(date) {
						date.cssClass = 'calendarEventSolo_before';
						date.date = new Date(date.start * 1000);
						$scope.specialDates.push(date);
						if (typeof date.class !== 'undefined') {
							$scope.kurse.push(Classes.class({
								classId: date.class.id
							}));
						}
					});
				});

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
		$scope.$watch('kurse', function(kurs) {
			console.log(kurs);
		});
	});