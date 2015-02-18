'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:CoopCtrl
 * @description
 * # CoopCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('CoopCtrl', function($scope, $state, Coop, $modal, FlashService, FileUploader) {
		$scope.coop = {};

		if ($state.params.id != 'new') {
			$scope.coop = Coop.get({
				coopId: $state.params.id
			}, function(response) {
				if (!response.id) {
					$state.go('coops');
				}
			});
		}
		$scope.image = {};
		$scope.files = [];
		$scope.uploadMultiple = false;
		$scope.saveCoop = function(isValid) {
			if (isValid) {
				if ($scope.coop.id) {
					Coop.update({
						coopId: $scope.coop.id
					}, $scope.coop, function(response) {
						if (response.status == true) {
							FlashService.show(response.message, '', 'success');
						} else {
							FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
						}
					});
				} else {
					Coop.create($scope.coop, function(response) {
						if (response.status == true) {
							FlashService.show(response.message, '', 'success');
							$state.go('coop', {
								id: response.coop.id
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
			cat: 'mitglieder',
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
			uploader.formData[0].id = $scope.coop.id;
			fileItem.formData[0].id = $scope.coop.id;

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
			delete $scope.coop.image;
			$scope.coop.image_id = 0;
		};
		$scope.addImages = function(isValid) {
			$scope.coop.image = $scope.image;
			$scope.coop.image_id = $scope.image.id;
			$scope.image = {};
			$scope.uploadImagesModal.hide();
		};
	});