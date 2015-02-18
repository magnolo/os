'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:CoopsCtrl
 * @description
 * # CoopsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('CoopsCtrl', function($scope, Coop, FlashService) {
		$scope.coops = Coop.query({
			order: 'position'
		});
		$scope.deleteCoop = function(coop) {
			if (confirm("Mitglied:\n" + coop.title + "\nentgültig entfernen?")) {
				Coop.remove({
					coopId: coop.id
				}, function(response) {
					if (response.status == true) {
						FlashService.show(response.message, '', 'success');
						$scope.coops.splice($scope.coops.indexOf(coop), 1);
					} else {
						FlashService.show('Löschen fehlgeschlagen!', '', 'danger');
					}
				})
			}
		};
		$scope.sortController = {
			additionalPlaceholderClass: 'col-lg-2 col-md-4 col-sm-6 col-xs-12 no-pad',
			orderChanged: function(event) {
				var list = [];
				angular.forEach($scope.coops, function(coop) {
					list.push(coop.id);
				});
				Coop.sort({
					list: list
				}, function(response) {
					if (response.status == false) {
						FlashService.show('Fehlgeschlagen', '', 'danger');
					} else {
						FlashService.show(response.message, '', 'success');
					}
				});
			}
		};
		$scope.setOnline = function(coop, online) {
			Coop.update({
				coopId: coop.id
			}, {
				online: online
			}, function(response) {
				if (response.status == true) {
					FlashService.show(response.message, '', 'success');
					coop.online = online;
				} else {
					FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
				}
			});
		};
	});