'use strict';

angular.module('osApp')
	.filter('badDateToIso', function() {

		return function(badTime) {
			var goodTime = badTime.replace(/(.+) (.+)/, '$1T$2Z');
			return goodTime;
		};
	}).filter('timestampToISO', function() {
		return function(input) {
			input = new Date(input).toISOString();
			return input;
		};
	});