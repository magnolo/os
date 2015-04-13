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
                    //console.log($scope.newsletters);
                }
            }
        }

        $scope.deleteNewsletter = function(nl) {

            if (confirm("Newsletter:\n" + nl.title + "\nentgültig entfernen?")) {
                Newsletter.removeCampaign({
                    id: nl.mailchimp_id
                }, function(data) {
                    if (data.status) {
                        $scope.newsletters.splice($scope.newsletters.indexOf(nl), 1);
                        FlashService.show(data.message, '', 'success');
                    } else {
                        FlashService.show('Newsletter konnte nicht gelöscht werden!', '', 'danger');
                    }
                })
            }
        };
    });