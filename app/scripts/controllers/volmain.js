'use strict';

angular.module('osApp')
	.controller('VolmainCtrl', function($scope, Categorie, $modal, MainSort,FlashService) {
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
		$scope.openVolSorterModal = function(){
			$scope.catModal = $modal({
					scope: $scope,
					show: false,
					template: 'views/admin/modal/volsort.html'
			});
			$scope.catModal.$promise.then($scope.catModal.show);
		};
		$scope.sortController = {
    	orderChanged: function(event) {
				var pos = 999;
				var arts = [];
				var kurses = [];
					angular.forEach($scope.articles, function(article){
							var art = {
								id: article.id,
								position:pos
							};
							if(article.type == 'article'){
								arts.push(art);
							}
							else if(article.type == 'kurs'){
								kurses.push(art)
							}
							pos--;
					});
					MainSort.sortArticles({},{
						list: arts
					}, function(data){
						if(data.status == true){
							FlashService.show(data.message, '', 'success');
						} else {
								FlashService.show('Speichern Fehlgeschlagen', '', 'danger', 5);
						}
					});
					MainSort.sortClasses({},{
						list: kurses
					}, function(data){
						if(data.status == true){
							FlashService.show(data.message, '', 'success');
						} else {
								FlashService.show('Speichern Fehlgeschlagen', '', 'danger', 5);
						}
					});
			}
		};
	});
