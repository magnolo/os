'use strict';

angular.module('osApp')
	.controller('VolunsmainCtrl', function($scope, Article, Person) {
		$scope.article = Article.get({
			articleId: 596
		});
		$scope.persons = Person.query({
			order: 'position',
			section: 3
		});
	});