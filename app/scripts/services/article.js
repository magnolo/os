'use strict';

angular.module('osApp')
	.factory('Article', function($resource) {
		return $resource('http://www.openscience.or.at/api/article/:articleId/:type/:data', {}, {
			query: {
				method: 'GET',
				params: {
					articleId: ''
				},
				isArray: true
			},
			get: {
				method: 'GET'
			},
			addFile: {
				method: 'POST',
				params: {
					articleId: 'file'
				}
			},
			removeFile: {
				method: 'DELETE',
				params: {
					type: 'file'
				}
			},
			addImage: {
				method: 'POST',
				params: {
					articleId: 'image'
				}
			},
			removeImage: {
				method: 'DELETE',
				params: {
					type: 'image'
				}
			},
			update: {
				method: 'PUT',
				params: {
					articleId: ''
				}
			},
			create: {
				method: 'POST'
			},
			remove: {
				method: 'DELETE',
				params: {
					articleId: ''
				}
			},
			sort: {
				method: 'PUT',
				params: {
					articleId: 'position'
				}
			},
			partners: {
				method: 'POST',
				params: {
					articleId: '',
					type: 'partners'
				}
			},
			tags:{
				method:'POST',
				params:{
					articleId:'',
					type:'tags'
				}
			},
			overview: {
				method: 'GET',
				params: {
					articleId: 'overview'
				},
				isArray: true
			},
			connections: {
				method: 'GET',
				params: {
					type: 'connectionsbyname',
					view: 'full'
				},
				isArray: true
			},
			addConnection: {
				method: 'POST',
				params: {
					articleId: '',
					type: 'connection',
					data: ''

				}
			},
			removeConnection: {
				method: 'DELETE',
				params: {
					type: 'connection'
				}
			}

		});
	})
	.factory('MainSort', function($resource){
		return $resource('http://www.openscience.or.at/api/:type/main_position',{},{
			sortArticles:{
				method:'PUT',
				params:{
					type:'articles'
				}
			},
			sortClasses:{
				method:'PUT',
				params:{
					type:'classes'
				}
			}
		})
	})
	.factory('Ajax', function($resource) {
		return $resource('http://www.openscience.or.at/assets/ajax/:action', {}, {
			contentToEmail: {
				method: 'GET',
				params: {
					action: 'contentToEmail.php',
					id: ''
				}
			}
		});
	});
