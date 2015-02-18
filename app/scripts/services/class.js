'use strict';

angular.module('osApp')
	.factory('Classes', function($resource) {
		return $resource('http://www.openscience.or.at/api/:kind/:classId/:action/:actionId', {}, {
			query: {
				method: 'GET',
				params: {
					kind: 'classes',
					classId: ''
				},
				isArray: true
			},
			get: {
				method: 'GET',
				params: {
					kind: 'class'
				}
			},
			dates: {
				method: 'GET',
				params: {
					kind: 'class',
					action: 'dates'
				},
				isArray: true
			},
			files: {
				method: 'GET',
				params: {
					kind: 'class',
					action: 'files'
				},
				isArray: true
			},
			seminare: {
				method: 'GET',
				params: {
					kind: 'seminare'

				},
				isArray: true
			},
			camps: {
				method: 'GET',
				params: {
					kind: 'summercamps'

				},
				isArray: true
			},
			class: {
				method: 'GET',
				params: {
					kind: 'class'
				}
			},
			labfree: {
				method: 'GET',
				params: {
					kind: 'free'
				},
				isArray: true
			},
			update: {
				method: 'PUT',
				params: {
					kind: 'class',
					classId: ''
				}
			},
			remove: {
				method: 'DELETE',
				params: {
					kind: 'class'
				}
			},
			create: {
				method: 'POST',
				params: {
					kind: 'class'
				}
			},
			addFile: {
				method: 'POST',
				params: {
					kind: 'class',
					action: 'file'
				}
			},
			removeFile: {
				method: 'DELETE',
				params: {
					kind: 'class',
					action: 'file'
				}
			},
			sections: {
				method: 'GET',
				params: {
					kind: 'classes',
					classId: 'sections'
				},
				isArray: true
			}
		});
	});