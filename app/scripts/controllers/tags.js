'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:TagsCtrl
 * @description
 * # TagsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('TagsCtrl', function($scope, $modal, FlashService, Tags) {
		$scope.tags = Tags.query();
		$scope.predicate = 'title';
		$scope.tag = {};
		$scope.hideModal = function() {
			$scope.tagModal.hide();
		};
		$scope.showModal = function() {
			$scope.tagModal = $modal({
				show: false,
				template: 'views/admin/modal/tag.html',
				scope: $scope
			});
			$scope.tagModal.$promise.then($scope.tagModal.show);
		};
		$scope.newTag = function() {
			$scope.tag = {};
			$scope.showModal();
		}
		$scope.editTag = function(tag) {
			$scope.tag = tag;
			$scope.showModal();
		};
		$scope.setOnline = function(tag, online) {
			Tags.update({
				tagId: tag.id
			}, {
				active: online
			}, function(response) {
				if (response.status == true) {
					FlashService.show(response.message, '', 'success');
					tag.active = online;
				} else {
					FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
				}
			});
		};
		$scope.deleteTag = function(tag) {
			if (confirm("Schlagwort:\n" + tag.title + "\nentgültig entfernen?")) {
				Tags.remove({
					tagId: tag.id
				}, function(response) {
					if (response.status == true) {
						FlashService.show(response.message, '', 'success');
						$scope.tags.splice($scope.tags.indexOf(tag), 1);
					} else {
						FlashService.show('Löschen fehlgeschlagen!', '', 'danger');
					}
				})
			}
		};
		$scope.saveTag = function(isValid) {
			if (isValid) {
				if (typeof $scope.tag.id != "undefined") {
					Tags.update({
						tagId: $scope.tag.id
					}, $scope.tag, function(response) {
						if (response.status == true) {
							FlashService.show('Schlagwort erfolgreich gespeichert!', '', 'success');
							$scope.hideModal();
						} else {
							FlashService.show('Speichern fehlgeschlagen', '', 'danger');
						}
					});
				} else {
					Tags.create($scope.tag, function(response) {
						if (response.status == true) {
							FlashService.show('Schlagwort erfolgreich gespeichert!', '', 'success');
							$scope.hideModal();
						} else {
							FlashService.show('Speichern fehlgeschlagen', '', 'danger');
						}
					});
				}
			}
		};
	});