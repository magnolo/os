'use strict';

angular.module('osApp')
	.controller('UnsimpressumCtrl', function($scope, Article) {
		$scope.article = Article.get({
			articleId: 593
		});
	});