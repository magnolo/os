'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:datepickersolo
 * @description
 * # datepickersolo
 */

Array.prototype.sortOn = function (key) {
	this.sort(function (a, b) {
		if (a[key] < b[key]) {
			return -1;
		} else if (a[key] > b[key]) {
			return 1;
		}
		return 0;
	});
}
angular.module('osApp')
	.directive('datepickersolo', function (Classes) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModel) {
				var sD = [];
				var cal = element.glDatePicker({
					prevArrow: '<span class="os-icon prev-icon"></span>',
					nextArrow: '<span class="os-icon next-icon" style="margin-left:-5px"></span>',
					showAlways: true,
					cssName: 'flatwhite',
					dowNames: ['S', 'M', 'D', 'M', 'D', 'F', 'S'],
					dowOffset: 1,
					monthNames: ['J&auml;nner', 'Februar', 'M&auml;rz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
					selectableDates: [],
					specialDates: [],
					onClick: function (el, cell, date, data) {
						var free = [];
						angular.forEach(data.hours, function (gap) {
							var start = moment(gap.from_time * 1000);
							var end = moment(gap.to_time * 1000).subtract(scope.selectedClass.duration, 'hours').add(30, 'minutes');
							do {
								var mom = {
									time: start.format('HH:mm'),
									lab: gap.labor,
									full: start.valueOf()
								};
								var found = false;
								angular.forEach(free, function(av){
									if(av.full == mom.full){
										found = true;
										av.lab = 1;
									}
								});
								if(!found){
									free.push(mom);
								}
								start.add(30, 'minutes');
							} while (start.isBefore(end));
						});
						free.sortOn('full');
						data.free = free;
						scope.$apply(function () {
							if (typeof scope.selectedFirstDate === 'undefined') {
								scope.selectedDate = data;
								scope.selectedFirstDate = moment(date).format('DD.MM.YYYY');
							} else {
								scope.selectedSecond = data;
								scope.selectedSecondDate = moment(date).format('DD.MM.YYYY');
							}
						});
					}
				}).glDatePicker(true);
				scope.$watch('selectedPlaces', function (value) {
					if (value == 0) {
						cal.options.selectableDates = [];
						cal.render();
						return;
					}
					
					scope.fetching = true;
					scope.fetchdates = Classes.labfree({
						class_id: scope.selectedClass.id,
						places: scope.selectedPlaces
					}, function (data) {
						cal.options.selectableDates = [];
						cal.options.specialDates = [];
						angular.forEach(data, function (date) {
							var d = {
								date: new Date(date.time * 1000),
								data: date,
								cssClass: date.cssClass
							}
							cal.options.selectableDates.push(d);
							cal.options.specialDates.push(d);
						})
						scope.fetching = false;
						cal.render();
					});
				});
			}
		};
	});
