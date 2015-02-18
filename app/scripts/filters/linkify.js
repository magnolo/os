'use strict';

/**
 * @ngdoc filter
 * @name osApp.filter:linkify
 * @function
 * @description
 * # linkify
 * Filter in the osApp.
 */
angular.module('osApp')
	.filter('linkify', function() {
		return function(inputText) {

			//URLs starting with http://, https://, or ftp://
			var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
			var replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

			//URLs starting with www. (without // before it, or it'd re-link the ones done above)
			var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
			var replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

			//Change email addresses to mailto:: links
			var replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
			var replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

			return replacedText;
		};
	});