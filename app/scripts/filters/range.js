'use strict';

angular.module('osApp')
	.filter('range', function () {
		return function (input, min, max) {
			min = parseInt(min); //Make string input int
			max = parseInt(max);
			for (var i = min; i <= max; i++) {
				input.push(i);
			}
			return input;
		};
	}).filter('labcount', function () {
		return function (input, min, course, lab) {
			if (!course) {
				return;
			}
			if (typeof course === 'undefined') {
				return;
			}
			if (typeof lab === 'undefined') {
				lab = false;
			}
			var limit = 20;
			if (course.labor_2 == 1 && (lab == 2 || lab == false)) {
				limit = 30;
			}
			for (var i = min; i <= limit; i++) {
				input.push(i);
			}
			return input;
		};
	})
	.filter('coursedur', function () {
		return function (courses, duration, type, lab) {
			var list = [];
			if (typeof lab !== "undefined") {
				lab = "labor_" + lab;
			} else {
				lab = false;
			}
			angular.forEach(courses, function (course) {
				if (course.duration <= (duration / 60) && course[type] == 1) {
					if (lab) {
						if (course[lab] == 1) {
							list.push(course);
						}
					} else {
						list.push(course);
					}
				}
			});
			return list;
		}
	})
	.filter('hours', function () {
		return function (input, hours, course) {
			if (typeof hours === "undefined" || hours.length == 0) {
				return;
			}
			var interval = 30;
			var retVal = [];
			angular.forEach(hours, function (time) {
				var start = time.from_time * 1000;
				var end = time.to_time * 1000;
				var current = moment(time.from_time * 1000);

				do {
					retVal.push({hour:current.format('HH:mm'), lab:time.lab});
					start += interval * 60 * 1000;
					current = moment(start);
				} while (start <= end - course.duration * 3600000)
			})
			return retVal;
		};
	});
