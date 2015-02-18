'use strict';

angular.module('osApp')
	.controller('VolcategorieCtrl', function($scope, $state, $document, $location, Categorie, $stateParams) {
		$scope.article = {};
		$scope.activeCategorie = $stateParams.categorie;
		$scope.articles = Categorie.get({
			categorieName: 'vol',
			type: $stateParams.categorie,
			action: 'articles',
			order: 'position'
		});
		$scope.setContext = function(article) {
			if (!$scope.article.edit) {
				$scope.article = article;
			}
		};
		$scope.editArticle = function() {

			$scope.article.edit = true;
			var articleDOM = angular.element(document.getElementById($scope.article.name));
			$document.scrollToElement(articleDOM, 70, 200);
		};
		$scope.saveArticle = function() {

			$scope.article.edit = true;
			console.log($scope.article);
		};
		$scope.abortArticle = function() {
			$scope.article.edit = false;
		};
		$scope.deleteArticle = function() {
			$scope.articles.splice($scope.articles.indexOf($scope.article), 1);
			$scope.article = {};
		};
		$scope.switchNew = function() {
			if ($scope.article.isNew === 1) {
				$scope.article.isNew = 0;
			} else {
				$scope.article.isNew = 1;
			}
		};

	});