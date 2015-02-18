'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:GlossarCtrl
 * @description
 * # GlossarCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('GlossarCtrl', function($scope, $modal, FlashService, Glossar) {
		$scope.glossars = Glossar.query();
		$scope.predicate = 'title';
		$scope.glossar = {};
		$scope.hideModal = function() {
			$scope.glossarModal.hide();
		};
		$scope.showModal = function() {
			$scope.glossarModal = $modal({
				show: false,
				template: 'views/admin/modal/glossar.html',
				scope: $scope
			});
			$scope.glossarModal.$promise.then($scope.glossarModal.show);
		};
		$scope.newGlossar = function() {
			$scope.glossar = {};
			$scope.showModal();
		}
		$scope.editGlossar = function(item) {
			$scope.glossar = item;
			$scope.showModal();
		};
		$scope.setOnline = function(glossar, online) {
			Glossar.update({
				glossarId: glossar.id
			}, {
				active: online
			}, function(response) {
				if (response.status == true) {
					FlashService.show(response.message, '', 'success');
					glossar.active = online;
				} else {
					FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
				}
			});
		};
		$scope.deleteGlossar = function(glossar) {
			if (confirm("Eintrag:\n" + glossar.word + "\nentgültig entfernen?")) {
				Glossar.remove({
					glossarId: glossar.id
				}, function(response) {
					if (response.status == true) {
						FlashService.show(response.message, '', 'success');
						$scope.glossars.splice($scope.glossars.indexOf(glossar), 1);
					} else {
						FlashService.show('Löschen fehlgeschlagen!', '', 'danger');
					}
				})
			}
		};
		$scope.saveGlossar = function(isValid) {
			if (isValid) {
				if (typeof $scope.glossar.id != "undefined") {
					Glossar.update({
						glossarId: $scope.glossar.id
					}, $scope.glossar, function(response) {
						if (response.status == true) {
							FlashService.show('Schlagwort erfolgreich gespeichert!', '', 'success');
							$scope.hideModal();
						} else {
							FlashService.show('Speichern fehlgeschlagen', '', 'danger');
						}
					});
				} else {
					$scope.glossar.active = 1; 
					Glossar.create($scope.glossar, function(response) {
						if (response.status == true) {
							FlashService.show('Schlagwort erfolgreich gespeichert!', '', 'success');
							$scope.glossars.push(response.entry);
							$scope.hideModal();
						} else {
							FlashService.show('Speichern fehlgeschlagen', '', 'danger');
						}
					});
				}
			}
		};
	});