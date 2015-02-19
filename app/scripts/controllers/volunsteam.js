'use strict';

angular.module('osApp')
    .controller('VolunsteamCtrl', function($scope, $state, $document, $timeout, Person) {
        $scope.persons = Person.query({
            order: 'position',
            section: 3
        }, function() {
            $timeout(function() {
                $timeout(function() {
                    var name = angular.element(document.getElementById($state.params.name));
                    $document.scrollToElement(name, 70);
                }, 200);

            });
        });
    });
