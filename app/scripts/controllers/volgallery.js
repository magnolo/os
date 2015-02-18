'use strict';

angular.module('osApp')
    .controller('VolgalleryCtrl', function($scope, $state, Gallery) {

        $scope.dates = Gallery.dates();
        $scope.selectedAlbum = [];
        $scope.ready = false;
        $scope.dateFilter = "";
        $scope.setdate = "";
        $scope.getActive = function(id) {
            angular.forEach($scope.galleries, function(item) {
                if (item.id === id) {
                    $scope.selectedAlbum = item;
                }
            });
        };
        $scope.galleries = Gallery.query(function() {
            if (typeof $state.params.id !== 'undefined') {
                $scope.getActive($state.params.id);
            }
            $scope.ready = true;

        });
        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (typeof toParams.id !== 'undefined') {
                $scope.getActive(toParams.id);
            } else {
                delete $scope.selectedAlbum;
            }

        });
        $scope.moreItems = function() {
            if ($scope.ready) {
                $scope.ready = false;

            }
        };
        $scope.$watchCollection('setdate', function(newItem, oldItem) {
            console.log(newItem);
        });
    });
