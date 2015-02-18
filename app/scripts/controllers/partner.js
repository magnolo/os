'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:PartnerCtrl
 * @description
 * # PartnerCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('PartnerCtrl', function($scope, $state, Partner, $modal, FlashService, FileUploader) {
		$scope.partner = {};

		if ($state.params.id != 'new') {
			$scope.partner = Partner.get({
				partnerId: $state.params.id
			}, function(response) {
				if (!response.id) {
					$state.go('partners');
				}
			});
		}
		$scope.image = {};
		$scope.files = [];
		$scope.uploadMultiple = false;
		$scope.savePartner = function(isValid) {
			if (isValid) {
				if ($scope.partner.id) {
					Partner.update({
						partnerId: $scope.partner.id
					}, $scope.partner, function(response) {
						if (response.status == true) {
							FlashService.show(response.message, '', 'success');
						} else {
							FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
						}
					});
				} else {
					Partner.create($scope.partner, function(response) {
						if (response.status == true) {
							FlashService.show(response.message, '', 'success');
							$state.go('partner', {
								id: response.partner.id
							});
						} else {
							FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
						}
					})
				}

			}
		};
		var uploader = $scope.uploader = new FileUploader({
			url: 'http://www.openscience.or.at/assets/ajax/uploadImages.php',
			alias: 'qqfile',
			queueLimit: 20
		});
		uploader.formData = [{
			cat: 'partner',
			id: 'new'
		}];
		// FILTERS
		uploader.filters.push({
			name: 'imageFilter',
			fn: function(item /*{File|FileLikeObject}*/ , options) {
				var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
				return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
			}
		});
		// CALLBACKS
		uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
			//console.info('onWhenAddingFileFailed', item, filter, options);
		};
		uploader.onAfterAddingFile = function(fileItem) {
			uploader.formData[0].id = $scope.partner.id;
			fileItem.formData[0].id = $scope.partner.id;

		};
		uploader.onSuccessItem = function(fileItem, response, status, headers) {
			if ($scope.uploadMultiple) {
				$scope.images.push(response.image);
			} else {
				$scope.image = response.image;
			}

		};
		$scope.openImagesModal = function(multiple) {
			uploader.clearQueue();
			$scope.images = [];
			$scope.image = {};
			$scope.uploadMultiple = multiple;
			if (!multiple) {
				uploader.queueLimit = 1;
				$scope.image.id = 0;
			} else {
				uploader.queueLimit = 20;
			}
			$scope.uploadImagesModal = $modal({
				scope: $scope,
				template: 'views/admin/modal/uploadImages.html',
				show: false
			});
			$scope.uploadImagesModal.$promise.then($scope.uploadImagesModal.show);
		};
		$scope.deleteImage = function() {
			delete $scope.partner.image;
			$scope.partner.image_id = 0;
		};
		$scope.addImages = function(isValid) {
			$scope.partner.image = $scope.image;
			$scope.partner.image_id = $scope.image.id;
			$scope.image = {};
			$scope.uploadImagesModal.hide();
		};
	});