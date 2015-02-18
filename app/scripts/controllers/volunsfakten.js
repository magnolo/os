'use strict';

angular.module('osApp')
	.controller('VolunsfaktenCtrl', function($scope, Article) {
		$scope.article = Article.get({
			articleId: 607
		});
	});