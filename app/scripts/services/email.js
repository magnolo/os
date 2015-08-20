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
		return $resource('http://www.openscience.or.at/api/email/:type/:id', {}, {
			regmail: {
				method: 'POST',
				params: {
          type: 'ticket',
					id: ''
				}
			},
      sendArticle:{
        method: 'POST',
        params:{
          type: 'article',
          id:''
        }
      }
		});
	})
