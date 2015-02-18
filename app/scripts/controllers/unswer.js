'use strict';

angular.module('osApp')
	.controller('UnswerCtrl', function($scope, $document, $timeout, $state, Person) {
		$scope.persons = Person.query({
			order: 'position'
		}, function() {
			$timeout(function() {
				$timeout(function() {
					var name = angular.element(document.getElementById($state.params.name));
					$document.scrollToElement(name, 70);
				}, 200);

			});
		});
	});