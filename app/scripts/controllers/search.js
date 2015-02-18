'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('SearchCtrl', function($scope, $state, Search) {
		$scope.query = $state.params.name;
		$scope.search = Search.query({
			action: $state.params.name
		}, function(data) {
			$scope.articles = data;
		});
	});