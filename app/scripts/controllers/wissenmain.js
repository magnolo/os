'use strict';

angular.module('osApp')
	.controller('WissenmainCtrl', function($scope, $state, $stateParams, Categorie) {

		$scope.ready = false;
		$scope.articles = Categorie.articles({
			categorieName: $stateParams.section,
			new: 'true',
			active: 1
		}, function() {
			$scope.ready = true;
		});
		$scope.moreItems = function() {
			if ($scope.ready) {
				$scope.ready = false;
				var ids = [];
				angular.forEach($scope.articles, function(article) {
					ids.push(article.id);
				});
				Categorie.articles({
					categorieName: $stateParams.section,
					active: 1,
					limit: 12,
					order: 'RAND()',
					parent: 0,
					not: ids.join()
				}, function(data) {
					$scope.ready = true;
					angular.forEach(data, function(article) {
						$scope.articles.push(article);
					});
				});
			}

		};
		$scope.$watchCollection('filtered', function(data) {
			if (typeof data === 'undefined') {
				return;
			} else {

				if (data.length < 6) {
					$scope.moreItems();
				}
			}
		});
	});