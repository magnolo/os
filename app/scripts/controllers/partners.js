'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:PartnersCtrl
 * @description
 * # PartnersCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('PartnersCtrl', function($scope, Partner, FlashService) {
		$scope.partners = Partner.query({
			order: 'position'
		});
		$scope.deletePartner = function(partner) {
			if (confirm("Förderer:\n" + partner.title + "\nentgültig entfernen?")) {
				Partner.remove({
					partnerId: partner.id
				}, function(response) {
					if (response.status == true) {
						FlashService.show(response.message, '', 'success');
						$scope.partners.splice($scope.partners.indexOf(partner), 1);
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
				angular.forEach($scope.partners, function(person) {
					list.push(person.id);
				});
				Partner.sort({
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
		$scope.setOnline = function(partner, online) {
			Partner.update({
				partnerId: partner.id
			}, {
				online: online
			}, function(response) {
				if (response.status == true) {
					FlashService.show(response.message, '', 'success');
					partner.online = online;
				} else {
					FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
				}
			});
		};
	});