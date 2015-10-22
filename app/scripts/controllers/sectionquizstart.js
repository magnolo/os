'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:SectionquizstartCtrl
 * @description
 * # SectionquizstartCtrl
 * Controller of the osApp
 */
angular.module('osApp')
	.controller('SectionquizstartCtrl', function ($scope, $stateParams, Quiz) {
		$scope.q = {};
		$scope.stats = {};
		$scope.position = 0;
		$scope.showMyAnswers = false;
		$scope.startet = false;
		$scope.finished = false;
		$scope.section = $stateParams.section || 'vol';
		//console.log($scope.section);
		$scope.$parent.quiz.$promise.then(function () {
			angular.forEach($scope.$parent.quiz, function (quiz, index) {
				if (quiz.name == $stateParams.name) {
					$scope.q = quiz;

				}
			});
		});
		$scope.startQuiz = function () {
			$scope.startet = true;
			$scope.position = 1;
		};
		$scope.changeQuestion = function (value) {
			$scope.position += value;
		};
		$scope.user = {};
		$scope.answers = [];
		$scope.setAnswer = function (question, answer) {
			var answer = {
				questionId: question.id,
				answerId: question.answers.indexOf(answer),
				answer: answer.id,
				correct: (answer.correct == 1 ? true : false)
			};
			$scope.answers[question.id] = answer;

		};
		$scope.setAnswers = function (question, answer) {
			var removed = false;
			var corrects = 0;
			var wrongs = 0;
			var item = {
				questionId: question.id,
				answerId: question.answers.indexOf(answer),
				answer: answer.id,
				correct: (answer.correct == 1 ? true : false),
			};
			if (typeof $scope.answers[question.id] == "undefined") {
				$scope.answers[question.id] = {
					questionId: question.id,
					correct: false,
					correct_answers: JSON.parse(question.success_answer_multiple),
					answers: []
				};
			}
			angular.forEach($scope.answers[question.id].answers, function (ua, k) {
				if (ua.answerId == item.answerId) {
					$scope.answers[question.id].answers.splice(k, 1);
					removed = true;
				}
			});
			if (!removed) {
				$scope.answers[question.id].answers.push(item);
			}
			angular.forEach($scope.answers[question.id].answers, function (a) {
				if ($scope.answers[question.id].correct_answers.indexOf(a.answerId) > -1) {
					corrects++;
				} else {
					wrongs++;
				}
			})
			if (corrects == $scope.answers[question.id].correct_answers.length && wrongs == 0) {
				$scope.answers[question.id].correct = true;
			} else {
				$scope.answers[question.id].correct = false;
			}
			//console.log($scope.answers);
		};
		$scope.showAnswers = function (show) {
			$scope.showMyAnswers = true;
		};
		$scope.userAnswered = function (answer, question) {
			var found = false;
			angular.forEach($scope.answers, function (a, index) {
				if (typeof a != "undefined") {
					if (a.questionId == question.id) {
						if (question.type == 1) {
							if (question.answers.indexOf(answer) == a.answerId) {
								found = true;
							}
						} else {
              angular.forEach(a.answers, function(aa){
                if(aa.answerId == question.answers.indexOf(answer)){
                  found = true;
                }
              })
						}
					}
				}
			});
			return found;
		};
		$scope.finish = function () {
			var rights = 0;
			angular.forEach($scope.answers, function (a, index) {
				if (typeof a != "undefined") {
					if (a.correct) {
						rights++;
					}
				}
			});
			$scope.stats = {
				right: rights,
				percent: 100 / $scope.q.questions.length * rights
			};
			$scope.result = {
				quiz_id: $scope.q.id,
				correct_count: $scope.stats.right,
				questions_count: $scope.q.questions.length
			};
			$scope.finished = true;
			Quiz.setresult({
				quizId: $scope.q.id
			}, $scope.result, function (data) {
				if (data.status == true) {

				} else {

				}
			});
		};
	});
