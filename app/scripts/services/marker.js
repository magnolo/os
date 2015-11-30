'use strict';

angular.module('osApp')
	.factory('Marker', function($resource) {
		return $resource('http://www.openscience.or.at/api/markers/:markerId/:type', {}, {
			query: {
				method: 'GET',
				params: {
					markerId: ''
				},
				isArray: true
			},
			get: {
				method: 'GET'
			},
			update:{
				method: 'PUT',
				params:{
					markerId: ''
				}
			},
			create:{
				method: 'POST',
				params: {
					markerId: ''
				}
			}

		});
	});
