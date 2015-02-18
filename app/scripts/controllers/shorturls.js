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
					Shorturls.create($scope.url, function(response) {
						if (response.success == true) {
							FlashService.show('ShortUrl erfolgreich gespeichert!', '', 'success');
							$scope.hideModal();
						} else {
							FlashService.show('Speichern fehlgeschlagen', '', 'danger');
						}
					});
				}
			}
		};
	});