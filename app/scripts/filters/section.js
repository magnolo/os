'use strict';

angular.module('osApp')
	.filter('section', function() {
		return function(items, ids) {
			return items.filter(function(item) {
				angular.forEach(ids, function(id) {
					if (item.section.id === id) {
						return true;
					}
				});
				return false;
			});
		};
	});