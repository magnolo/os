'use strict';

/**
 * @ngdoc service
 * @name osApp.user
 * @description
 * # user
 * Factory in the osApp.
 */
angular.module('osApp')
	.factory('User', function($resource) {
		return $resource('http://www.openscience.or.at/api/accounts/:userId/:action', {}, {
			get:{
				method:'GET'
			},
			query: {
				method: 'GET',
				params: {
					userId: ''
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
			},
			checkpassword:{
				method: 'POST',
				params:{
					action:'checkpass'
				}
			}

		});
	}).factory('Role', function($resource) {
		return $resource('http://www.openscience.or.at/api/roles/:roleId', {}, {
			get:{
				method:'GET'
			},
			query: {
				method: 'GET',
				params: {
					roleId: ''
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
