'use strict';

angular.module('osApp')
	.controller('VolcampsCtrl', function($scope, $state, $timeout, $document, $rootScope, Article, Classes) {
		$scope.article = Article.get({
			articleId: 595
		}, function() {
			$rootScope.isLoading = true;
			if (typeof $state.params.camp !== 'undefined') {
				$timeout(function() {
					$timeout(function() {
						var article = angular.element(document.getElementById($state.params.camp));
						$document.scrollToElement(article, 70);
						$rootScope.isLoading = false;
					}, 200);

				});
			} else {
				$rootScope.isLoading = false;
			}

		});
		$scope.kurse = Classes.camps({
			active: 1,
			order: 'position'
		});
	});