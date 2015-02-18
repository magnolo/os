'use strict';

angular.module('osApp')
    .controller('VolgalleryCtrl', function($scope, $state, Gallery) {

        $scope.dates = Gallery.dates();
        $scope.selectedAlbum = [];
        $scope.ready = false;
        $scope.dateFilter = "";
        $scope.page = 1;
        $scope.selectedDate = {
            set: ''
        };
        $scope.getActive = function(id) {
            angular.forEach($scope.galleries, function(item) {
                if (item.id === id) {
                    $scope.selectedAlbum = item;
                }
            });
        };
        $scope.galleries = Gallery.query({
            id: 'all'
        }, function() {
            if (typeof $state.params.id !== 'undefined') {
                $scope.getActive($state.params.id);
            }
            $scope.ready = true;
            $scope.page++;
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
                Gallery.query({
                    limit: 12,
                    page: $scope.page,
                    id: 'all'
                }, function(data) {
                    angular.forEach(data, function(item) {
                        $scope.galleries.push(item);
                    })
                    $scope.page++;
                    $scope.ready = true;
                });
            }

        };
        /*  $scope.$watchCollection('selectedDate.set', function(newItem, oldItem) {
              $scope.galleries = Gallery.query({
                  date: newItem.set,
                  limit: 12,
                  page: 3
              });
          });*/


    });
