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
        $scope.galleries = [];
        $scope.getActive = function(id) {
            angular.forEach($scope.galleries, function(item) {
                if (item.id === id) {
                    $scope.selectedAlbum = item;
                }
            });
        };
        if (typeof $state.params.id !== 'undefined') {
            $scope.selectedAlbum = true;
            Gallery.get({
                id: 'all',
                action: $state.params.id
            }, function(data) {
                $scope.galleries.push(data);
                $scope.ready = true;
                $scope.getActive($state.params.id);
            });

        } else {
            $scope.galleries = Gallery.query({
                id: 'all'
            }, function() {

                $scope.ready = true;
                $scope.page++;
            });
        }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            if (typeof toParams.id !== 'undefined') {
                $scope.getActive(toParams.id);
            } else {
                delete $scope.selectedAlbum;
            }

        });
        $scope.fetchAlbums = function() {
            var date = '';
            if ($scope.selectedDate.set != '') {
                date = $scope.selectedDate.set.substring(0, 7) + '-01';
            }
            Gallery.query({
                limit: 12,
                page: $scope.page,
                id: 'all',
                date: date
            }, function(data) {
                angular.forEach(data, function(item) {
                    var found = false;
                    angular.forEach($scope.galleries, function(album) {
                        if (album.id == item.id) {
                            found = true;
                        }
                    });
                    if (!found) {
                        $scope.galleries.push(item);
                    }

                })
                if (date == '') {
                    $scope.page++;

                }

                $scope.ready = true;
            });
        }
        $scope.moreItems = function() {
            if ($scope.ready && $scope.selectedDate.set == '') {
                $scope.ready = false;
                $scope.fetchAlbums();
            }

        };
        $scope.$watchCollection('selectedDate.set', function(newItem, oldItem) {
            if (newItem == oldItem) {
                return;
            }
            $scope.fetchAlbums();
        });
    });
