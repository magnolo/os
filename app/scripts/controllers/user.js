'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('UserCtrl', function($scope, User, Role, FlashService, $modal) {
        $scope.users = User.query();
        $scope.roles = Role.query();
        $scope.error = {};
        $scope.openUserModal = function() {
            $scope.userModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/user.html',
                show: false
            });
            $scope.userModal.$promise.then($scope.userModal.show);
        }
        $scope.editUser = function(user) {
            $scope.user = user;
            $scope.openUserModal();
        };
        $scope.newUser = function() {
            $scope.user = {};
            $scope.openUserModal();

        };
        $scope.updateUserData = function() {
            User.update({
                userId: $scope.user.id
            }, {
                name: $scope.user.name,
                username: $scope.user.username,
                role_id: $scope.user.role_id,
                password: $scope.user.pass,

            }, function(data) {
                if (data.status == true) {
                    FlashService.show(data.message, '', 'success');
                    $scope.userModal.hide();
                }
            });
        };
        $scope.deleteUser = function(user) {
            if (confirm('Account von:\n' + user.name + '\nentgültig entfernen?')) {
                User.remove({
                    userId: user.id
                }, function(data) {
                    if (data.status == true) {
                        $scope.users.splice($scope.users.indexOf(user), 1);
                        FlashService.show(data.message, '', 'success');
                    }
                })
            }
        };
        $scope.setActive = function(user, active) {
            User.update({
                userId: user.id
            }, {
                active: active
            }, function(data) {
                if (data.status == true) {
                    FlashService.show(data.message, '', 'success');
                    user.active = active;
                }
            });
        };
        $scope.saveUser = function(isValid) {
            $scope.error.found = false;
            if (isValid) {
                if ($scope.user.id) {
                    if ($scope.user.pass) {
                        if ($scope.user.re_pass) {
                            if ($scope.user.pass == $scope.user.re_pass) {
                                User.checkpassword({
                                    userId: $scope.user.id
                                }, {
                                    password: $scope.user.old_pass
                                }, function(data) {
                                    if (data.status == false) {
                                        $scope.error.found = true;
                                        $scope.error.message = "Vorhandenes Passwort falsch!";
                                        return;
                                    } else {
                                        $scope.updateUserData();
                                    }
                                });
                            } else {
                                $scope.error.found = true;
                                $scope.error.message = "Passwörter stimmen nicht überein!";
                                return;
                            }
                        } else {
                            $scope.error.found = true;
                            $scope.error.message = "Sie müssen das Passwort wiederholen!";
                            return;
                        }

                    } else {
                        $scope.updateUserData();
                    }
                } else {
                    if ($scope.user.pass) {
                        if ($scope.user.re_pass) {
                            if ($scope.user.pass == $scope.user.re_pass) {
                                User.create({
                                    name: $scope.user.name,
                                    username: $scope.user.username,
                                    role_id: $scope.user.role_id,
                                    password: $scope.user.pass,
                                    active: 0

                                }, function(data) {
                                    if (data.status == true) {
                                        FlashService.show(data.message, '', 'success');
                                        $scope.userModal.hide();
                                        $scope.users.push(data.user);
                                    }
                                });
                            } else {
                                $scope.error.found = true;
                                $scope.error.message = "Passwörter stimmen nicht überein!";
                                return;
                            }
                        } else {
                            $scope.error.found = true;
                            $scope.error.message = "Sie müssen das Passwort wiederholen!";
                            return;
                        }
                    } else {
                        $scope.error.found = true;
                        $scope.error.message = "Sie müssen ein Passwort festlegen!";
                        return;
                    }

                }
            }
        }
    });
