'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the osApp
 */
angular.module('osApp')
  .controller('UserCtrl', function ($scope, User, Role, FlashService, $modal) {
  	$scope.users = User.query();
  	$scope.roles = Role.query();
  	$scope.openUserModal = function(){
  		$scope.userModal = $modal({
  			scope: $scope,
  			template: 'views/admin/modal/user.html',
  			show: false
  		});
  		$scope.userModal.$promise.then($scope.userModal.show);
  	}
  	$scope.editUser = function(user){
  		$scope.user = user;
  		$scope.openUserModal();
  	};
  	$scope.newUser = function(){
  		$scope.user = {};
  		$scope.openUserModal();
  	};
  	$scope.saveUser = function(isValid){
  		if($scope.user.pass){
  			
  		}
  		if(isValid){
  			if($scope.user.id){

  			}
  			else{

  			}
  		}
  	}
  });
