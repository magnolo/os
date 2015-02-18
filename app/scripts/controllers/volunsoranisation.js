'use strict';

angular.module('osApp')
	.controller('VolunsoranisationCtrl', function($scope, Article) {
		$scope.article = Article.get({
			articleId: 608
		});
	});