'use strict';

angular.module('osApp')
	.controller('VolkontaktCtrl', function($scope, Article) {
		$scope.article = Article.get({
			articleId: 584
		});
	});