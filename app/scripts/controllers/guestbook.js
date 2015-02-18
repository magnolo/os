'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:GuestbookCtrl
 * @description
 * # GuestbookCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('GuestbookCtrl', function($scope, $modal, FlashService, Guestbook) {
		$scope.guestbook = Guestbook.query();
		$scope.entry = {};
		$scope.toggleActive = function(entry) {

		};
		$scope.deleteEntry = function(entry) {

		};
		$scope.showEntry = function(entry) {
			$scope.entry = entry;
			$scope.gbModal = $modal({
				scope: $scope,
				template: 'views/admin/modal/guestbook.html',
				show: false
			});
			$scope.gbModal.$promise.then($scope.gbModal.show);
		};
	});