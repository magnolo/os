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
        headertext: $scope.configs['headertext'].value,
        headertext_vol : $scope.configs['headertext_vol'].value,
        footertext : $scope.configs['footertext'].value,
        footertext_vol : $scope.configs['footertext_vol'].value
      };
      Newsletter.configSave(data,function(data){
          FlashService.show('Speichern erfolgreich!', '', 'success');
      });
    };
  });
