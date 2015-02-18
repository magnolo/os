'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:ClassCtrl
 * @description
 * # ClassCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('ClassCtrl', function($scope, $state, $stateParams, $modal, $alert, FlashService, FileEdit, Classes, FileUploader) {
		$scope.course = {};
		if ($stateParams.id != 'new') {
			$scope.course = Classes.get({
				classId: $stateParams.id
			}, function(response) {
				if (!response.id) {
					$state.go('classes');
				}
			});
		}
		$scope.sections = Classes.sections();
		$scope.image = {};
		$scope.files = [];
		$scope.uploadMultiple = false;

		$scope.saveClass = function(isValid) {
			console.log(isValid);
			if (isValid) {
				if ($scope.course.id) {
					Classes.update({
						classId: $scope.course.id
					}, $scope.course, function(response) {
						if (response.status == true) {
							FlashService.show(response.message, '', 'success');
						} else {
							FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
						}
					});
				} else {
					Classes.create($scope.course, function(response) {
						if (response.status == true) {
							FlashService.show(response.message, '', 'success');
							$state.go('class', {
								id: response.class.id
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
			cat: 'class',
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
			uploader.formData[0].id = $scope.course.id;
			fileItem.formData[0].id = $scope.course.id;

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
			delete $scope.course.image;
			$scope.course.image_id = 0;
		};
		$scope.openFilesModal = function() {
			uploaderFiles.clearQueue();
			$scope.files = [];
			$scope.uploadFilesModal = $modal({
				scope: $scope,
				template: 'views/admin/modal/uploadFiles.html',
				show: false
			});
			$scope.uploadFilesModal.$promise.then($scope.uploadFilesModal.show);
		};
		$scope.addFiles = function(isValid) {

			if ($scope.course.files == null) {
				$scope.course.files = [];
			}
			angular.forEach($scope.files, function(file) {
				Classes.addFile({
					file_id: file.id,
					class_id: $scope.course.id
				}, function() {
					$scope.course.files.push(file);
				});

			});
			$scope.files = [];
			$scope.uploadFilesModal.hide();
		};
		$scope.removeFile = function(file) {
			Classes.removeFile({
				classId: $scope.course.id,
				actionId: file.id
			}, function(response) {
				if (response.status == true) {
					$scope.course.files.splice($scope.course.files.indexOf(file), 1);
				}
			});
		};
		$scope.updateFileName = function(file, data) {
			FileEdit.update({
				fileId: file.id
			}, {
				name: data
			}, function(response) {

			});
		};
		var uploaderFiles = $scope.uploaderFiles = new FileUploader({
			url: 'http://www.openscience.or.at/assets/ajax/uploadFiles.php',
			alias: 'qqfile',
		});
		uploaderFiles.formData = [{
			cat: 'class',
			id: 'new'
		}];

		// CALLBACKS
		uploaderFiles.onAfterAddingFile = function(fileItem) {
			uploaderFiles.formData[0].id = $scope.course.id;
			fileItem.formData[0].id = $scope.course.id;
		};
		uploaderFiles.onSuccessItem = function(fileItem, response, status, headers) {
			$scope.files.push(response.file);
		};

		$scope.addImages = function(isValid) {

			$scope.course.image = $scope.image;
			$scope.course.image_id = $scope.image.id;
			$scope.image = {};
			$scope.uploadImagesModal.hide();
		};
	});