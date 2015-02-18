'use strict';

angular.module('osApp')
	.factory('File', function($resource) {
		return $resource('http://www.openscience.or.at/ajax/:action', {}, {
			zip: {
				method: 'GET',
				params: {
					action: 'downloadZip.php'
				}
			},
			file: {
				method: 'GET',
				params: {
					action: 'downloadFile.php'
				}
			}
		});
	})
	.factory('FileEdit', function($resource) {
		return $resource('http://www.openscience.or.at/api/file/:fileId', {}, {
			update: {
				method: 'PUT',
				params: {
					fileId: ''
				}
			}
		});
	})
	.factory('ImageEdit', function($resource) {
		return $resource('http://www.openscience.or.at/api/image/:imageId', {}, {
			update: {
				method: 'PUT',
				params: {
					imageId: ''
				}
			}
		});
	});