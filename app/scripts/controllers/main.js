'use strict';

angular.module('osApp')
	.controller('MainCtrl', function($scope, Article, Categorie, Classes) {
		$scope.ready = {
			wissen: false,
			projekte: false,
			schulcorner: false,
			vol: false
		};
		$scope.wissen = Categorie.get({
			categorieName: 'wissen',
			type: 'articles',
			limit: 4,
			active: 1,
			new: true
		}, function() {
			$scope.ready.wissen = true;
		});
		$scope.projekte = Categorie.get({
			categorieName: 'projekte',
			type: 'articles',
			limit: 4,
			active: 1,
			new: true
		}, function() {
			$scope.ready.projekte = true;
		});
		$scope.schulcorner = Categorie.get({
			categorieName: 'schulcorner',
			type: 'articles',
			limit: 4,
			active: 1,
			new: true
		}, function() {
			$scope.ready.schulcorner = true;
		});
		$scope.vol = Categorie.volarticles({
			categorieName: 'vol',
			type: 'articles',
			limit: 4,
			active: 1,
			order: 'main_position'
		}, function() {
			$scope.ready.vol = true;
		});

		$scope.wer = Article.get({
			articleId: 542
		});
		$scope.was = Article.get({
			articleId: 543
		});

		$scope.moreItems = function() {

			var wids = [];
			var pids = [];
			var sids = [];
			var vids = [];
			var clids = [];

			if ($scope.ready.wissen) {
				$scope.ready.wissen = false;
				angular.forEach($scope.wissen, function(article) {
					wids.push(article.id);
				});
				Categorie.articles({
					categorieName: 'wissen',
					active: 1,
					limit: 4,
					order: 'RAND()',
					parent: 0,
					not: wids.join()
				}, function(data) {
					$scope.ready.wissen = true;
					angular.forEach(data, function(article) {
						$scope.wissen.push(article);
					});
				});
			}
			if ($scope.ready.projekte) {
				$scope.ready.projekte = false;
				angular.forEach($scope.projekte, function(article) {
					pids.push(article.id);
				});
				Categorie.articles({
					categorieName: 'projekte',
					active: 1,
					limit: 4,
					order: 'RAND()',
					parent: 0,
					not: pids.join()
				}, function(data) {
					$scope.ready.projekte = true;

					angular.forEach(data, function(article) {
						$scope.projekte.push(article);
					});
				});
			}
			if ($scope.ready.schulcorner) {
				$scope.ready.schulcorner = false;
				angular.forEach($scope.schulcorner, function(article) {
					sids.push(article.id);
				});
				Categorie.articles({
					categorieName: 'schulcorner',
					active: 1,
					limit: 4,
					order: 'RAND()',
					parent: 0,
					not: sids.join()
				}, function(data) {
					$scope.ready.schulcorner = true;

					angular.forEach(data, function(article) {
						$scope.schulcorner.push(article);
					});
				});
			}
			if ($scope.ready.vol) {
				$scope.ready.vol = false;
				angular.forEach($scope.vol, function(article) {
					vids.push(article.id);
				});
				Categorie.volarticles({
					categorieName: 'vol',
					active: 1,
					limit: 4,
					order: 'RAND()',
					parent: 0,
					not: vids.join()
				}, function(data) {
					$scope.ready.vol = true;
					angular.forEach(data, function(article) {
						$scope.vol.push(article);
					});
				});
			}

		};
	});