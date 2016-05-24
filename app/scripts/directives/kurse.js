'use strict';

angular.module('osApp')
	.directive('kurse', function(Classes) {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/directive/kurse.html',
			link: function(scope, elem, attr) {
				scope.locate = attr.locate;
				scope.offset = attr.offset;
				scope.section = attr.section;
				scope.filter.age = attr.age;
			}
			/*link: function(scope) {
				scope.inView = function($index, $inview, $inviewpart, kurs) {
		if (!kurs.dates) {
			kurs.dates = Classes.get({
				classId: kurs.id,
				action: 'dates'
			});
		}
		if (!kurs.files) {
			kurs.files = Classes.get({
				classId: kurs.id,
				action: 'files'
			});
		}
				};
			}*/
		};
	});
