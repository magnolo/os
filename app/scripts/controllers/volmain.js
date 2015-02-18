'use strict';

angular.module('osApp')
	.controller('VolmainCtrl', function($scope, Categorie) {
		$scope.ready = false;
		$scope.articles = Categorie.volarticles({
			categorieName: 'vol',
			new: 'true',
			active: 1,
			order: 'main_position',
			limit: 12
		}, function() {
			$scope.ready = true;
		});
		$scope.moreItems = function() {
			if ($scope.ready) {
				$scope.ready = false;
				var articleids = [];
				var classids = [];
				angular.forEach($scope.articles, function(article) {
					if (article.type == 'article') {
						articleids.push(article.id);
					} else {
						classids.push(article.id);
					}

				});
				Categorie.volarticles({
					categorieName: 'vol',
					active: 1,
					limit: 12,
					order: 'main_position',
					parent: 0,
					not: articleids.join(),
					classnot: classids.join()
				}, function(data) {
					$scope.ready = true;
					angular.forEach(data, function(article) {
						$scope.articles.push(article);
					});
				});
			}

		};
	});