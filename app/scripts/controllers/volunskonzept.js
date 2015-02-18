'use strict';

angular.module('osApp')
	.controller('VolunskonzeptCtrl', function($scope, Article) {
		$scope.article = Article.get({
			articleId: 596
		});
	});