'use strict';

angular.module('osApp')
	.controller('UnscoopsCtrl', function($scope, Coop) {
		$scope.coops = Coop.query({
			order: 'position',
			online: 1
		});
	});