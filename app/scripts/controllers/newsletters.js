'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:NewslettersCtrl
 * @description
 * # NewslettersCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('NewslettersCtrl', function($scope, FlashService, Newsletter) {
        $scope.newsletters = Newsletter.query(function() {
            mergeLetters();
        });
        $scope.campaigns = Newsletter.campaigns(function(data) {
            mergeLetters();
        });

        function mergeLetters() {
            if (typeof $scope.campaigns.data != "undefined") {
                if ($scope.campaigns.data.length && $scope.newsletters.length) {
                    angular.forEach($scope.newsletters, function(newsletter) {
                        angular.forEach($scope.campaigns.data, function(campaign) {
                            if (newsletter.mailchimp_id == campaign.id) {
                                newsletter.mailchimp = campaign;
                            }
                        })
                    });
                    console.log($scope.newsletters);
                }
            }
        }
    });
