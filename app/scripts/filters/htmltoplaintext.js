'use strict';

angular.module('osApp')
	.filter('htmlToPlaintext', function() {
		return function(input) {
			var text = String(input).replace(/<[^>]+>/gm, '');
			return text.substring(0, text.indexOf('.') + 1);
		};
	})
	.filter('htmlToPlain', function() {
		return function(input) {
			return String(input).replace(/<[^>]+>/gm, '');
		};
	});