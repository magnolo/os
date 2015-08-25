'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:ShorturlsCtrl
 * @description
 * # ShorturlsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('ShorturlsCtrl', function($scope, $modal, FlashService, Shorturls) {
		$scope.url = {};
		$scope.predicate = 'title';
		$scope.shorturls = Shorturls.query();
		$scope.urlModal = $modal({
			scope: $scope,
			template: 'views/admin/modal/shorturl.html',
			show: false
		});
		$scope.qrModal = $modal({
			scope: $scope,
			template: 'views/admin/modal/qrcode.html',
			show: false
		});
		$scope.showModal = function() {
			$scope.urlModal.$promise.then($scope.urlModal.show);
		};
		$scope.showQrCode = function() {
			$scope.qrModal.$promise.then($scope.qrModal.show);
		};
		$scope.hideModal = function() {
			$scope.urlModal.hide();
		};
		$scope.editUrl = function(url) {
			$scope.edit = true;
			$scope.keyword = url.keyword;
			$scope.url = url;
			$scope.showModal();
		};
		$scope.newUrl = function() {
			$scope.edit = false;
			$scope.url = {};
			$scope.showModal();
		};
		$scope.getQrCode = function(url) {
			$scope.url = url;
			$scope.showQrCode();
		};
		$scope.deleteUrl = function(short){
			if(confirm('ShortURL: '+short.title+'\nentgültig entfernen?')){
				Shorturls.remove({
					id: short.keyword
				},{}, function(data){
						if(data.status == true){
							$scope.shorturls.splice($scope.shorturls.indexOf(short),1);
								FlashService.show('ShortUrl erfolgreich entfernt!', '', 'success');
						}
						else{
							FlashService.show('Löschen fehlgeschlagen', '', 'danger');
						}
				});
			}
		};
		$scope.saveUrl = function(isValid) {
			if (isValid) {
				if ($scope.edit) {
					Shorturls.update({
						id: $scope.keyword
					}, $scope.url, function(response) {
						if (response.success == true) {
							FlashService.show('ShortUrl erfolgreich gespeichert!', '', 'success');
							$scope.hideModal();
						} else {
							FlashService.show('Speichern fehlgeschlagen', '', 'danger');
						}
					});
				} else {
						var yougo = yourls.connect('http://www.openscience.or.at/shorturls/yourls-api.php', {
							username: 'short',
							password: '12ShortItDown'
							//signature: 'qpFr0GdU409u4Vb8cv92s3'
						});
						yougo.shorten($scope.url.url, $scope.url.keyword, $scope.url.title, function (data) {
							if(data.url){
								FlashService.show('ShortUrl erfolgreich gespeichert!', '', 'success');
								$scope.hideModal();
								data.url.clicks = 0;
								$scope.shorturls.push(data.url);
							}
							else{
									FlashService.show('Speichern fehlgeschlagen', '', 'danger');
							}
						});
				/*	Shorturls.create($scope.url, function(response) {
						if (response.success == true) {
							FlashService.show('ShortUrl erfolgreich gespeichert!', '', 'success');
							$scope.hideModal();
						} else {
							FlashService.show('Speichern fehlgeschlagen', '', 'danger');
						}
					});*/
				}
			}
		};
	});
