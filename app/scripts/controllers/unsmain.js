'use strict';

angular.module('osApp')
	.controller('UnsmainCtrl', function($scope, Article, Person) {
		$scope.article = Article.get({
			articleId: 542
		});
		$scope.persons = Person.query({
			order: 'position'
		});
	});