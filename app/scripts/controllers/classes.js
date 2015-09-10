'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:ClassesCtrl
 * @description
 * # ClassesCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('ClassesCtrl', function ($scope, FlashService, Classes) {
		$scope.classes = Classes.query();
		$scope.predicate = 'title';
		$scope.activation = function(course){
				course.active = course.active == 1 ? 0 : 1;
				Classes.update({
					classId: course.id
				},{
					active: parseInt(course.active)
				}, function(data){
					if (data.status == true) {

						FlashService.show(data.message, '', 'success');
					} else {
						FlashService.show('Speichern fehlgeschlagen', '', 'danger');
					}
				});
		};
		$scope.deleteClass = function (course) {
			if (confirm('Kurs:\n' + course.title + '\nentgültig entfernen?')) {
				Classes.remove({
					classId: course.id
				}, function (response) {
					if (response.status == true) {
						$scope.classes.splice($scope.classes.indexOf(course), 1);
						FlashService.show(response.message, '', 'success');
					} else {
						FlashService.show('Löschen fehlgeschlagen', '', 'danger');
					}
				})
			}
		};
	});
