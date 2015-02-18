'use strict';

angular.module('osApp')
	.factory('Search', function($resource) {
		return $resource('http://www.openscience.or.at/api/:type/:action', {}, {
			query: {
				method: 'GET',
				params: {
					type: 'fullsearching',
					action: ''
				},
				isArray: true
			},
			search: {
				method: 'GET',
				params: {
					type: 'search',
					query: ''
				}
			}
		});
	});