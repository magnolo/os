'use strict';

angular.module('osApp')
	.controller('UnswasCtrl', function($scope, Article, Marker) {
		$scope.article = Article.get({
			articleId: 543
		});
		$scope.markers = Marker.query();
	});