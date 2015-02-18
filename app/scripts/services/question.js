'use strict';

angular.module('osApp')
	.factory('Question', function($resource) {
		return $resource('http://www.openscience.or.at/api/question', {}, {
			query: {
				method: 'GET'
			}
		});
	});