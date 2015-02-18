'use strict';

angular.module('osApp')
	.controller('VolseminareCtrl', function($scope, $state, $timeout, $document, $rootScope, Classes, Article) {
		$scope.kurse = Classes.seminare({
			active: 1,
			order: 'position'
		}, function() {
			$rootScope.isLoading = true;
			if (typeof $state.params.seminar !== 'undefined') {
				$timeout(function() {
					$timeout(function() {
						var article = angular.element(document.getElementById($state.params.seminar));
						$document.scrollToElement(article, 70);
						$rootScope.isLoading = false;
					}, 200);

				});
			} else {
				$rootScope.isLoading = false;
			}

		});
		$scope.article = Article.get({
			articleId: 594
		});
	});