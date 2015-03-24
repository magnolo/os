'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:QuizCtrl
 * @description
 * # QuizCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('QuizCtrl', function($scope, Quiz, FlashService) {
        $scope.quizes = Quiz.query();
        $scope.types = [{
            id: "1",
            name: 'Quiz'
        }, {
            id: "2",
            name: 'Umfrage'
        }];
        $scope.removeIt = function(quiz) {
            Quiz.removeQuiz({
                quizId: quiz.id
            }, function(data) {
                if (data.status == true) {
                    $scope.quizes.splice($scope.quizes.indexOf(quiz), 1);
                } else {
                    FlashService.show('Quiz konnte nicht entfernt werden!', '', 'danger');
                }
            });
        };
        $scope.deleteQuiz = function(quiz) {
            if (confirm("Quiz entgültig entfernen?")) {
                if (quiz.stats.count > 0) {
                    if (confirm("Benutzer haben dieses Quiz bereits verwendet.\nTrotzdem entfernen?")) {
                        $scope.removeIt(quiz);
                    }
                } else {
                    $scope.removeIt(quiz);
                }
            }
        };
        $scope.toggleOnline = function(quiz) {
            if (quiz.is_online == 0) {
                quiz.is_online = 1;
            } else {
                quiz.is_online = 0;
            }
            Quiz.update({
                quizId: quiz.id
            }, {
                is_online: quiz.is_online
            }, function(data) {
                if (data.status == true) {
                    FlashService.show(data.message, '', 'success');
                } else {
                    FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                }
            });
        };
    });