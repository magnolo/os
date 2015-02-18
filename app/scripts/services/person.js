'use strict';

angular.module('osApp')
	.factory('Person', function($resource) {
		return $resource('http://www.openscience.or.at/api/persons/:personId/:type', {}, {
			query: {
				method: 'GET',
				params: {
					personId: ''
				},
				isArray: true
			},
			get: {
				method: 'GET'
			},
			sections: {
				method: 'GET',
				params: {
					personId: 'sections'
				},
				isArray: true
			},
			update: {
				method: 'PUT'
			},
			create: {
				method: 'POST'
			},
			remove: {
				method: 'DELETE'
			},
			sort: {
				method: 'PUT',
				params: {
					personId: 'sort'
				}
			}

		});
	});