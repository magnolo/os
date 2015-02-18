'use strict';

angular.module('osApp')
	.controller('UnspartnerCtrl', function($scope, Partner) {
		$scope.partners = Partner.query({
			order: 'position',
			online: 1
		});
	});