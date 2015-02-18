'use strict';

angular.module('osApp')
	.controller('UnscontactCtrl', function($scope, Article) {
		$scope.article = Article.get({
			articleId: 583
		});
	});