'use strict';

angular.module('osApp')
	.controller('UnswasCtrl', function($scope, Article, Marker,FlashService, $modal) {
		$scope.article = Article.get({
			articleId: 543
		});
		$scope.markers = Marker.query();

		//ADMIN PART
		$scope.editMarker = {};
		$scope.doSorting = false;
		$scope.showOffline = false;
		$scope.setMarkerContext = function(categorie) {
				$scope.editCategorie = categorie;
		};
		$scope.editMarker = function(){
			$scope.markerModal = $modal({
					scope: $scope,
					show: false,
					template: 'views/admin/modal/marker.html'
			});
			$scope.markerModal.$promise.then($scope.markerModal.show);
		};
		$scope.saveMarker = function(isValid){
			if (isValid) {
					if ($scope.editCategorie.id) {
							Marker.update({
									markerId: $scope.editCategorie.id
							}, {
									title: $scope.editCategorie.title,
									title_en : $scope.editCategorie.title_en,
									text:  $scope.editCategorie.text,
									text_en:  $scope.editCategorie.text_en,
							}, function(response) {
									if (response.status == true) {
											if (typeof $scope.catModal != "undefined") {
													$scope.catModal.hide();
											}
											FlashService.show(response.message, '', 'success');
									} else {
											FlashService.show('Speichern Fehlgeschlagen', '', 'danger', 5);
									}
							})
					} else {
						/*	Categorie.create({}, {
									title: $scope.editCategorie.title,
									active: $scope.editCategorie.active,
									parent_id: $scope.categorie.id,
									title_en : $scope.editCategorie.title_en
							}, function(response) {
									if (response.status == true) {
											$scope.categorie.categories.push(response.categorie);
											if (typeof $scope.catModal != "undefined") {
													$scope.catModal.hide();
											}
											FlashService.show(response.message, '', 'success');
									} else {
											FlashService.show('Speichern Fehlgeschlagen', '', 'danger', 5);
									}
							})*/
					}
			}
		};
	});
