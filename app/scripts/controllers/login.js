'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('LoginCtrl', function($rootScope, $location, $scope, $state, $modal, AuthService, FlashService) {

		$scope.doLogin = function(isValid) {
			if (isValid) {
				AuthService.login($scope.user).success(function(response) {
					$scope.loading = false;
					if (response.success == true) {
						FlashService.show('', response.message, 'success');
						console.log($rootScope.lastState.state.name);
						if($rootScope.lastState.state.name){
							$state.go($rootScope.lastState.state.name, $rootScope.lastState.params);
						}
						else{
							$state.go('home');
						}

					} else {
						FlashService.show('', response.message, 'danger');
					}
				}).error(function(response) {
					FlashService.show('', response.message, 'danger');
				});
			};
		};
		$scope.back = function() {
			if($rootScope.lastState.state.name){
							$state.go($rootScope.lastState.state.name, $rootScope.lastState.params);
						}
						else{
							$state.go('home');
						}
		};

	});
