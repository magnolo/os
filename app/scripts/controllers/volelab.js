'use strict';

angular.module('osApp')
	.controller('VolelabCtrl', function($scope, Elab) {
		$scope.elabs = Elab.sections();
	})
	.controller('VolelabsectionCtrl', function($scope, $stateParams, Elab) {
		$scope.elab = Elab.section({
			id: $stateParams.id
		});
		$scope.elabs = Elab.elabs({
			type: $stateParams.id,
			id: 'elabs'
		});
	})
	.controller('VolelabdetailsCtrl', function($scope, $stateParams, Elab) {
		$scope.elab = Elab.get({
			id: $stateParams.name
		});
	});