'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:QuizdetailsCtrl
 * @description
 * # QuizdetailsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('QuizdetailsCtrl', function($scope, $state, $modal, FlashService, Quiz, Article) {
        $scope.quiz = Quiz.get({
            quizId: $state.params.id
        });
        $scope.types = [{
            id: "1",
            name: 'Quiz'
        }, {
            id: "2",
            name: 'Umfrage'
        }];
        $scope.answertypes = [{
            id: "1",
            name: 'Single Choice'
        }, {
            id: "2",
            name: 'Multiple Choice'
        }];
        $scope.overview = Article.overview();
        $scope.sortFilter = '';
        $scope.articles = [];
        $scope.toggleSortFilter = function(sec) {
            if ($scope.sortFilter == sec) {
                $scope.sortFilter = '';
            } else {
                $scope.sortFilter = sec;
            }

        };
        $scope.showModal = function() {
            $scope.questionModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/question.html',
                show: false
            });
            $scope.questionModal.$promise.then($scope.questionModal.show);
        };
        $scope.hideModal = function() {
            $scope.questionModal.hide;
        };
        $scope.newQuestion = function() {
            $scope.question = {
                answers: []
            };
            $scope.showModal();
        };
        $scope.editQuestion = function(question) {
            $scope.question = question;
            $scope.showModal();
        };

        $scope.setAnswer = function(answer) {
            angular.forEach($scope.question.answers, function(a) {
                a.correct = 0;
            });
            answer.correct = 1;
        };
        $scope.deleteAnswer = function(answer) {
            $scope.question.answers.splice($scope.question.answers.indexOf(answer), 1);
        };
        $scope.addAnswer = function() {
            $scope.question.answers.push({});
        };
        $scope.saveQuestion = function() {
            console.log()
        };
        $scope.newConnection = function() {
            if ($scope.overview.length == 0) {
                $scope.overview = Article.overview();
            }
            $scope.connectionModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/connectionsId.html',
                show: false
            });
            $scope.connectionModal.$promise.then($scope.connectionModal.show);
        };
        $scope.toggleConnection = function(article) {
            var isIn = false;
            if (typeof $scope.quiz.articles == "undefined" || $scope.quiz.articles == null || !$scope.quiz.articles) {
                $scope.quiz.articles = [];
            }
            angular.forEach($scope.quiz.articles, function(id, key) {
                if (id == article.id) {
                    isIn = true;
                    $scope.quiz.articles.splice(key, 1);

                }
            });
            if (!isIn) {
                $scope.quiz.articles.push(article.id);
            }
        };
    });
