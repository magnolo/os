'use strict';

angular.module('osApp')
    .controller('MemberCtrl', function($scope, $state, $stateParams, Person, FileUploader, $modal, FlashService) {
        $scope.member = {};
        $scope.sections = Person.sections();
        if ($stateParams.id != 'new') {
            $scope.member = Person.get({
                personId: $stateParams.id
            }, function(response) {
                if ($scope.member.sections) {
                    $scope.member.sections = JSON.parse($scope.member.sections);
                } else {
                    $scope.member.sections = [];
                }
                if (!response.id) {
                    $state.go('classes');
                }
            });
        }
        $scope.image = {};
        $scope.files = [];
        $scope.uploadMultiple = false;

        $scope.saveMember = function(isValid) {
            if (isValid) {

                if ($scope.member.id) {
                    Person.update({
                        personId: $scope.member.id
                    }, $scope.member, function(response) {
                        if (response.status == true) {
                            FlashService.show(response.message, '', 'success');
                        } else {
                            FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
                        }
                    });
                } else {
                    Person.create($scope.member, function(response) {
                        if (response.status == true) {
                            FlashService.show(response.message, '', 'success');
                            $state.go('member', {
                                id: response.person.id
                            });
                        } else {
                            FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
                        }
                    })
                }

            }
        };
        var uploader = $scope.uploader = new FileUploader({
            url: 'http://www.openscience.or.at/assets/ajax/uploadImages.php',
            alias: 'qqfile',
            queueLimit: 20
        });
        uploader.formData = [{
            cat: 'team',
            id: 'new'
        }];
        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            uploader.formData[0].id = $scope.member.id;
            fileItem.formData[0].id = $scope.member.id;

        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if ($scope.uploadMultiple) {
                $scope.images.push(response.image);
            } else {
                $scope.image = response.image;
            }

        };
        $scope.openImagesModal = function(multiple) {
            uploader.clearQueue();
            $scope.images = [];
            $scope.image = {};
            $scope.uploadMultiple = multiple;
            if (!multiple) {
                uploader.queueLimit = 1;
                $scope.image.id = 0;
            } else {
                uploader.queueLimit = 20;
            }
            $scope.uploadImagesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/uploadImages.html',
                show: false
            });
            $scope.uploadImagesModal.$promise.then($scope.uploadImagesModal.show);
        };
        $scope.deleteImage = function() {
            delete $scope.member.image;
            $scope.member.image_id = 0;
        };
        $scope.addImages = function(isValid) {
            $scope.member.image = $scope.image;
            $scope.member.image_id = $scope.image.id;
            $scope.image = {};
            $scope.uploadImagesModal.hide();
        };
    });
