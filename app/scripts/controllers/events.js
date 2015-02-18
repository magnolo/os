'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('EventsCtrl', function($scope, Events) {
		$scope.events = Events.list();
	});