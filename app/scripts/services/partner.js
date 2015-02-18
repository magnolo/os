'use strict';

angular.module('osApp')
	.factory('Partner', function($resource) {
		return $resource('http://www.openscience.or.at/api/partners/:partnerId/:type', {}, {
			query: {
				method: 'GET',
				params: {
					partnerId: ''
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
					partnerId: 'sort'
				}
			}

		});
	});