'use strict';

angular.module('osApp')
	.factory('Tag', function($resource) {
		return $resource('http://www.openscience.or.at/api/tag/:name', {}, {
			query: {
				method: 'GET',
				params: {
					name: ''
				}
			}
		});
	})
	.factory('Tags', function($resource) {
		return $resource('http://www.openscience.or.at/api/tags/:tagId', {}, {
			query: {
				method: 'GET',
				params: {
					tagId: ''
				},
				isArray: true
			},
			update: {
				method: 'PUT'
			},
			remove: {
				method: 'DELETE'
			},
			create: {
				method: 'POST'
			}

		});
	});