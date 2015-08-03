/*global moment */
'use strict';

angular.module('osApp')
	.directive('datepicker', function($location, Events) {
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
					onClick: function(el, cell, date) {
						var d = new Date(date);
						$location.path('/vol/kalender/' + attrs.lab + '/' + moment(date).format('DD-MM-YYYY'));
						scope.$apply(function() {
							ngModel.$setViewValue(date);
							scope.selectedDate = d;
							scope.urlDate = moment(d).format('DD-MM-YYYY');
							scope.selectedLab = attrs.lab;
							scope.selected = true;
						});
						/* Events.query({
							kind: 'calendarstyle',
							labor: attrs.lab,
							date: moment(d).format('YYYY-MM-DD')
						}, function(data) {
							sD = [];
							angular.forEach(data, function(d) {
								d.date = new Date(d.time * 1000);
								sD.push(d);
							});
							cal.options.specialDates = sD;
							cal.render();
						});*/
					},
					selectedDate: scope.selectedDate
				}).glDatePicker(true);

				Events.query({
					kind: 'calendarstyle',
					labor: attrs.lab,
					date: moment(scope.selectedDate).format('YYYY-MM-DD')
				}, function(data) {
					sD = [];
					angular.forEach(data, function(d) {
						d.date = new Date(d.time * 1000);
						sD.push(d);
					});
					cal.options.specialDates = sD;
					cal.render(function() {
						console.log('render');
					});
				});

				ngModel.$render = function() {
					element.val(ngModel.$modelValue);
					element.change();
				};
			}
		};
	});
