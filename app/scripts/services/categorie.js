'use strict';

angular.module('osApp')
	.factory('Categorie', function($resource) {
		return $resource('http://www.openscience.or.at/api/categorie/:categorieName/:type/:action', {}, {
			query: {
				method: 'GET',
				params: {
					categorieName: ''
				}
			},
			get: {
				method: 'GET',
				params: {
					categorieName: ''
				},
				isArray: true
			},
			vol: {
				method: 'GET',
				params: {
					categorieName: ''
				},
				isArray: true
			},

			articles: {
				method: 'GET',
				params: {
					categorieName: '',
					type: 'articles'
				},
				isArray: true
			},
			volarticles: {
				method: 'GET',
				params: {
					categorieName: '',
					type: 'articles',
					action: 'volarticles'
				},
				isArray: true
			},
			categorie: {
				method: 'GET',
				params: {
					categorieName: '',
					type: ''
				},
				isArray: true
			},
			update: {
				method: 'PUT',
				params: {
					categorieName: ''
				}
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
					categorieName: 'position'
				}
			},
		});
	});