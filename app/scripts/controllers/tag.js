'use strict';

angular.module('osApp')
	.controller('TagCtrl', function($scope, $state, Tag) {
		$scope.tag = Tag.query({
			name: $state.params.name
		}, function(data) {
			$scope.articles = data.articles;
		});
	});