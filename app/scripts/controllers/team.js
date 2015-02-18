'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:TeamCtrl
 * @description
 * # TeamCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('TeamCtrl', function($scope, Person, FlashService) {
		$scope.members = Person.query({
			order: 'position'
		});
		$scope.deleteMember = function(member) {
			if (confirm("Person:\n" + member.firstname + " " + member.lastname + "\nentgültig entfernen?")) {
				Person.remove({
					personId: member.id
				}, function(response) {
					if (response.status == true) {
						FlashService.show(response.message, '', 'success');
						$scope.members.splice($scope.members.indexOf(member), 1);
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
				angular.forEach($scope.members, function(person) {
					list.push(person.id);
				});
				Person.sort({
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
	});