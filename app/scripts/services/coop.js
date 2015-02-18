'use strict';

angular.module('osApp')
	.factory('Coop', function($resource) {
		return $resource('http://www.openscience.or.at/api/coops/:coopId/:type', {}, {
			query: {
				method: 'GET',
				params: {
					coopId: ''
				},
				isArray: true
			},
			get: {
				method: 'GET'
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
					coopId: 'sort'
				}
			}

		});
	});