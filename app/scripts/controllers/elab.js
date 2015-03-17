'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:ElabCtrl
 * @description
 * # ElabCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('ElabCtrl', function($stateParams, $state, $scope, $modal, FlashService, Elab, FileUploader, FileEdit) {
        $scope.image = {};
        $scope.files = [];
        $scope.uploadMultiple = false;
        $scope.elab = Elab.section({
            id: $stateParams.id
        });
        $scope.elabs = Elab.sectionLabs({
            type: $stateParams.id
        });
        $scope.elabModal = $modal({
            template: 'views/admin/modal/elabentry.html',
            scope: $scope,
            show: false
        });
        $scope.saveElab = function() {
            if ($scope.elab.id) {
                Elab.update({
                    id: $scope.elab.id
                }, {
                    image_id: $scope.elab.image_id,
                    title: $scope.elab.title,
                    online: $scope.elab.online,
                    text: $scope.elab.text
                }, function(data) {
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                    } else {
                        FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                    }
                });
            } else {
                Elab.create({
                    image_id: $scope.elab.image_id,
                    title: $scope.elab.title,
                    online: $scope.elab.online,
                    text: $scope.elab.text
                }, function(data) {
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                        $state.go('elab', {
                            id: data.elab.title
                        });
                    } else {
                        FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                    }
                });
            }

        };
        $scope.toggleEntryOnline = function(entry) {
            var online = 0;
            if (entry.online == 0) {
                online = 1;
            }
            Elab.updateElabentry({
                type: entry.id
            }, {
                online: online
            }, function(data) {
                if (data.status == true) {
                    entry.online = online;
                    FlashService.show(data.message, '', 'success');
                } else {
                    FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                }
            })
        };
        $scope.viewElab = function(entry) {
            $scope.elabentry = entry;
            $scope.elabModal.show();
        };
        $scope.newElabentry = function() {
            $scope.elabentry = {};
            $scope.elabModal.show();
        };
        $scope.saveElabEntry = function(isValid) {
            if (isValid) {
                if ($scope.elabentry.container_url) {
                    if ($scope.elabentry.id) {
                        Elab.updateElabentry({
                            type: $scope.elabentry.id
                        }, {
                            container_url: $scope.elabentry.container_url,
                            online: $scope.elabentry.online,
                            title: $scope.elabentry.title,
                            text: $scope.elabentry.text
                        }, function(data) {
                            if (data.status == true) {
                                FlashService.show(data.message, '', 'success');
                                $scope.elabModal.hide();
                            } else {
                                FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                            }
                        });
                    } else {
                        Elab.addElabentry({
                            type: $scope.elabentry.id
                        }, {
                            container_url: $scope.elabentry.container_url,
                            online: $scope.elabentry.online,
                            title: $scope.elabentry.title,
                            text: $scope.elabentry.text,
                            section_id: $scope.elab.id
                        }, function(data) {
                            if (data.status == true) {
                                FlashService.show(data.message, '', 'success');
                                $scope.elabs.push(data.elab);
                                $scope.elabModal.hide();
                            } else {
                                FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                            }
                        });
                    }
                } else {
                    FlashService.show('Keine Animation festgelegt!', '', 'danger', 5);
                }
            }
        };
        $scope.deleteElabentry = function(entry) {
            if (confirm('eLAB Eintrag:\n' + entry.title + '\nentgültig entfernen?')) {
                Elab.removeElabentry({
                    type: entry.id
                }, function(data) {
                    if (data.status == true) {
                        $scope.elabs.splice($scope.elabs.indexOf(entry), 1);
                        FlashService.show(data.message, '', 'success');
                    } else {
                        FlashService.show('Löschen fehlgeschlagen!', '', 'danger');
                    }
                })
            }
        };

        $scope.sortController = {
            additionalPlaceholderClass: '',
            orderChanged: function(event) {
                var list = [];
                angular.forEach($scope.elabs, function(entry) {
                    list.push(entry.id);
                });
                Elab.sortEntries({
                    id: $scope.elab.id
                }, {
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

        var uploader = $scope.uploader = new FileUploader({
            url: 'http://www.openscience.or.at/assets/ajax/uploadImages.php',
            alias: 'qqfile',
            queueLimit: 20
        });
        uploader.formData = [{
            cat: 'elab',
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
            uploader.formData[0].id = $scope.elab.id;
            fileItem.formData[0].id = $scope.elab.id;

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
            delete $scope.elab.image;
            $scope.elab.image_id = 0;
        };
        $scope.addImages = function(isValid) {
            $scope.elab.image = $scope.image;
            $scope.elab.image_id = $scope.image.id;
            $scope.image = {};
            $scope.uploadImagesModal.hide();
        };

        var uploaderFiles = $scope.uploaderFiles = new FileUploader({
            url: 'http://www.openscience.or.at/assets/ajax/uploadFiles.php',
            alias: 'qqfile',
        });
        uploaderFiles.filters.push({
            name: 'flashFilter',
            fn: function(item, options) {
                return item;
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|swf|'.indexOf(type) !== -1;
            }
        });
        uploaderFiles.formData = [{
            cat: 'elab',
            id: 'new'
        }];

        $scope.openFilesModal = function() {
            uploaderFiles.clearQueue();
            $scope.file = {};
            $scope.uploadFilesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/uploadFiles.html',
                show: false
            });
            $scope.uploadFilesModal.$promise.then($scope.uploadFilesModal.show);
        };
        $scope.addFiles = function(isValid) {

            /*  if ($scope.elabitem.files == null) {
                  $scope.elabitem.files = [];
              }*/
            $scope.elabentry.container_url = '/' + $scope.file.url;
            /*	angular.forEach($scope.files, function(file) {
    				Classes.addFile({
    					file_id: file.id,
    					class_id: $scope.course.id
    				}, function() {
    					$scope.course.files.push(file);
    				});

            }); */
            $scope.file = {};
            $scope.uploadFilesModal.hide();
        };
        $scope.removeFile = function() {
            $scope.elabentry.container_url = '';
            /*	Classes.removeFile({
            				classId: $scope.course.id,
            				actionId: file.id
            			}, function(response) {
            				if (response.status == true) {
            					$scope.course.files.splice($scope.course.files.indexOf(file), 1);
            				}
            			});*/
        };
        // CALLBACKS
        uploaderFiles.onAfterAddingFile = function(fileItem) {
            uploaderFiles.formData[0].id = $scope.elabentry.id || 'new';
            fileItem.formData[0].id = $scope.elabentry.id || 'new';
        };
        uploaderFiles.onSuccessItem = function(fileItem, response, status, headers) {
            $scope.file = response.file;
        };
    });