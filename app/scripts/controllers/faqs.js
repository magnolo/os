'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:FaqsCtrl
 * @description
 * # FaqsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('FaqsCtrl', function($scope, Faq, $modal, FlashService) {
        $scope.faqs = Faq.query({
            section: 'vol',
            order: 'position'
        });
        $scope.openModal = function() {
            $scope.faqModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/faq.html',
                show: false
            });
            $scope.faqModal.$promise.then($scope.faqModal.show);
        };
        $scope.editFaq = function(item) {
            $scope.faq = item;
            $scope.openModal();
        };
        $scope.newFaq = function() {
            $scope.faq = {};
            $scope.openModal();
        };
        $scope.deleteFaq = function(item) {
            if (confirm('Eintrag\n' + item.title + '\nentgültig entfernen?')) {
                Faq.remove({
                    faqId: item.id
                }, function(data) {
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                        $scope.faqs.splice($scope.faqs.indexOf(item), 1);
                    }
                })
            }
        };
        $scope.sortController = {
            additionalPlaceholderClass: '',
            orderChanged: function(event) {
                var list = [];
                angular.forEach($scope.faqs, function(faq) {
                    list.push(faq.id);
                });
                Faq.sort({
                    list: list
                }, function(response) {
                    if (response.status == false) {
                        FlashService.show('Fehlgeschlagen', '', 'danger');
                    } else {
                        FlashService.show(response.message, '', 'success');
                    }
                });
            }
        };
        $scope.setOnline = function(item, online) {
            Faq.update({
                faqId: item.id
            }, {
                active: online
            }, function(response) {
                if (response.status == true) {
                    FlashService.show(response.message, '', 'success');
                    item.active = online;
                } else {
                    FlashService.show('Speicher fehlgeschlagen!', '', 'danger');
                }
            });
        };
        $scope.saveFaq = function(isValid) {
            if (isValid) {
                if ($scope.faq.id) {
                    Faq.update({
                        faqId: $scope.faq.id
                    }, {
                        text: $scope.faq.text,
                        title: $scope.faq.title
                    }, function(data) {
                        if (data.status == true) {
                            FlashService.show(data.message, '', 'success');
                            $scope.faqModal.hide();
                        }
                    });
                } else {
                    Faq.create({
                        text: $scope.faq.text,
                        title: $scope.faq.title,
                        section: 'vol',
                        active: '1'
                    }, function(data) {
                        if (data.status == true) {
                            FlashService.show(data.message, '', 'success');
                            $scope.faqs.push(data.entry);
                            $scope.faqModal.hide();
                        }
                    });
                }
            }
        };
    });
