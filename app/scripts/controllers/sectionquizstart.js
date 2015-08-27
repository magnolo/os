'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:SectionquizstartCtrl
 * @description
 * # SectionquizstartCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('SectionquizstartCtrl', function($scope, $stateParams, Quiz) {
        $scope.q = {};
        $scope.stats = {};
        $scope.position = 0;
        $scope.showMyAnswers = false;
        $scope.startet = false;
        $scope.finished = false;
        $scope.$parent.quiz.$promise.then(function() {
            angular.forEach($scope.$parent.quiz, function(quiz, index) {
                if (quiz.name == $stateParams.name) {
                    $scope.q = quiz;

                }
            });
        });
        $scope.startQuiz = function() {
            $scope.startet = true;
            $scope.position = 1;
        };
        $scope.changeQuestion = function(value) {
            $scope.position += value;
        };
        $scope.user = {};
        $scope.answers = [];
        $scope.setAnswer = function(question, answer) {
            var key = -1;
            var answer = {
                questionId: question.id,
                answerId: question.answers.indexOf(answer),
                answer: answer.id,
                correct: (answer.correct == 1 ? true : false)
            };
            angular.forEach($scope.answers, function(a, index) {
                if (a.questionId == question.id) {
                    key = index;
                }
            });
            if (key > -1) {
                $scope.answers[key] = answer;
            } else {
                $scope.answers.push(answer);
            }
        };
        $scope.showAnswers = function(show){
          $scope.showMyAnswers = true;
        };
        $scope.userAnswered = function(answer, question){
          var found = false;
          angular.forEach($scope.answers, function(a, index) {
            if(a.questionId == question.id){
              if(question.answers.indexOf(answer) == a.answerId){
                  found = true;
              }
            }
          });
          return found;
        };
        $scope.finish = function() {
            var rights = 0;
            angular.forEach($scope.answers, function(answer, index) {
                if (answer.correct) {
                    rights++;
                }
            });
            $scope.stats = {
                right: rights,
                percent: 100 / $scope.q.questions.length * rights
            };
            $scope.result = {
              quiz_id:  $scope.q.id,
              correct_count:$scope.stats.right,
              questions_count:$scope.q.questions.length
            };
            console.log($scope.result);
            console.log($scope.answers);
            $scope.finished = true;
            Quiz.setresult({quizId:$scope.q.id}, $scope.result, function(data){
                if(data.status == true){

                }
                else{

                }
            });
        };
    });
