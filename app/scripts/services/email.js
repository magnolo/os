'use strict';

/**
 * @ngdoc service
 * @name osApp.email
 * @description
 * # email
 * Service in the osApp.
 */
angular.module('osApp')
  .service('Email', function($resource) {
		return $resource('http://www.openscience.or.at/api/:module/:type/:id', {}, {
			regmail: {
				method: 'POST',
				params: {
          module: 'email',
          type: 'ticket',
					id: ''
				}
			},
      sendArticle:{
        method: 'POST',
        params:{
          module: 'email',
          type: 'article',
          id:''
        }
      },
      getPdf:{
        method:'GET',
        params:{
          module: 'pdf',
          type: 'article',
          id:''
        }
      }
		});
	})
