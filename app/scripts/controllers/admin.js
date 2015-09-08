'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:AdminCtrl
 * @description
 * # AdminCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('AdminCtrl', function($scope, $state, $rootScope, AuthService, FlashService, $modal, $alert) {
        $scope.showMenu = true;
        $scope.logout = function() {
            AuthService.logout().success(function() {
                $rootScope.isLoggedIn = false;
                if ($state.current.url.indexOf('/admin') != -1) {
                    $state.go('home');
                }
            });
        };
        $scope.toggleMenu = function() {
          $scope.showMenu = !$scope.showMenu;
        };
        $scope.toggleAdminMenu = function(){
            $rootScope.showAdminFullSize = !$rootScope.showAdminFullSize
        };
        $scope.toggleBigMenu = function(){

        };
        var modals = [];
        $rootScope.$on('modal.show', function(e, $modal) {
            // if modal is not already in list
            if (modals.indexOf($modal) === -1) {
                modals.push($modal);
            }
        });
        $rootScope.$on('modal.hide', function(e, $modal) {
            var modalIndex = modals.indexOf($modal);
            modals.splice(modalIndex, 1);
        });
        $rootScope.$on('$stateChangeStart', function() {

            // hide all modals
            if (modals.length) {
                angular.forEach(modals, function($modal) {
                    $modal.$promise.then($modal.hide);
                });
                modals = [];
            }
        });
    });
