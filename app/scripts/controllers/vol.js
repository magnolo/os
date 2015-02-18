'use strict';

angular.module('osApp')
	.controller('VolCtrl', function($scope, Categorie) {
		$scope.color = 'A31031';
		$scope.categorie = Categorie.categorie({
			categorieName: 'vol'
		}, function() {
			$scope.categorie = $scope.categorie[0];
		});

	});