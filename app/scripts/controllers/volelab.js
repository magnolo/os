'use strict';

angular.module('osApp')
    .controller('VolelabCtrl', function($scope, Elab) {
        $scope.elabs = Elab.sections({
            online: 1
        });
    })
    .controller('VolelabsectionCtrl', function($scope, $stateParams, Elab) {
        $scope.elab = Elab.section({
            id: $stateParams.id
        });
        $scope.elabs = Elab.elabs({
            type: $stateParams.id,
            id: 'elabs',
            online: 1
        });
    })
    .controller('VolelabdetailsCtrl', function($scope, $stateParams, Elab) {
        $scope.elab = Elab.get({
            id: $stateParams.name
        });
    });