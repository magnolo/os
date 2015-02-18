'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:EmailconfigCtrl
 * @description
 * # EmailconfigCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('EmailconfigCtrl', function($timeout, $scope, $state, FlashService, Article) {
        $scope.view = 'solo';
        $scope.setView = function(type) {
            $scope.view = type;
        };
        $scope.header = Article.get({
            articleId: 598
        });
        $scope.content_solo = Article.get({
            articleId: 599
        });
        $scope.content_group = Article.get({
            articleId: 601
        });
        $scope.footer = Article.get({
            articleId: 600
        });
        $scope.froalaOptions = {
            inlineMode: true
        };
        $scope.saveData = function() {
            Article.update({
                articleId: 598
            }, {
                text: $scope.header.text
            });
            Article.update({
                articleId: 599
            }, {
                text: $scope.content_solo.text
            });
            Article.update({
                articleId: 601
            }, {
                text: $scope.content_group.text
            });
            Article.update({
                articleId: 600
            }, {
                text: $scope.footer.text
            });
            $timeout(function() {
                FlashService.show('Speichern erfolgreich!', '', 'success');
            }, 250);

        };
    });
