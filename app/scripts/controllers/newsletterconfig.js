'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:NewsletterconfigCtrl
 * @description
 * # NewsletterconfigCtrl
 * Controller of the osApp
 */
angular.module('osApp')
  .controller('NewsletterconfigCtrl', function ($scope, Newsletter, FlashService) {
    $scope.configs = Newsletter.configs();
    $scope.view = 'os';
    $scope.saveData = function(){
      var data = {
        headertext: $scope.configs['headertext'],
        headertext_vol : $scope.configs['headertext_vol'],
        footertext : $scope.configs['footertext'],
        footertext_vol : $scope.configs['footertext_vol']
      };
      Newsletter.configSave(data,function(data){
          FlashService.show('Speichern erfolgreich!', '', 'success');
      });
    };
  });
