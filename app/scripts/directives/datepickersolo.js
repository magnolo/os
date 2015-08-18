'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:datepickersolo
 * @description
 * # datepickersolo
 */
angular.module('osApp')
	.directive('datepickersolo', function(Classes) {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
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
					onClick: function(el, cell, date, data) {
						scope.$apply(function() {
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
				scope.$watch('selectedPlaces', function(value) {
					if (value == 0) {
						cal.options.selectableDates = [];
						cal.render();
						return;
					}
					scope.fetching = true;
					scope.fetchdates = Classes.labfree({
						lab: 1,
						duration: scope.selectedClass.duration
					}, function(data) {
						angular.forEach(data, function(date) {
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
