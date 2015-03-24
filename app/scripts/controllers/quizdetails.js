'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:QuizdetailsCtrl
 * @description
 * # QuizdetailsCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('QuizdetailsCtrl', function($scope, $state, $modal, FlashService, Quiz, Article, FileUploader) {
        if ($state.params.id != "new") {
            $scope.quiz = Quiz.get({
                quizId: $state.params.id
            });
        } else {
            $scope.quiz = {
                is_online: 0,
                sections: []
            };
        }

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
        $scope.categories = ['wissen', 'projekte', 'schulcorner', 'vol'];
        $scope.overview = Article.overview();
        $scope.sortFilter = '';
        $scope.articles = [];
        $scope.saveQuiz = function(isValid) {
            if ($scope.quiz.id) {
                Quiz.update({
                    quizId: $scope.quiz.id
                }, $scope.quiz, function(data) {
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                    } else {
                        FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                    }
                })
            } else {
                Quiz.create($scope.quiz, function(data) {
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                        $state.go('quizdetails', {
                            id: data.quiz.id
                        });
                    } else {
                        FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                    }
                })
            }
        };
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
        $scope.deleteQuestion = function(question) {
            if (confirm('Frage entgültig entfernen?')) {
                Quiz.removeQuestion({
                    quizId: $scope.quiz.id,
                    typeId: question.id
                }, function(data) {
                    if (data.status == true) {
                        $scope.quiz.questions.splice($scope.quiz.questions.indexOf(question), 1);
                    } else {
                        FlashService.show('Frage konnte nicht entfernt werden!', '', 'danger');
                    }
                })
            }
        };
        $scope.sortController = {
            additionalPlaceholderClass: '',
            orderChanged: function(event) {
                console.log('there');
                var list = [];
                angular.forEach($scope.quiz.questions, function(entry) {
                    list.push(entry.id);
                });
                Quiz.sortQuestions({
                    quizId: $scope.quiz.id
                }, {
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
            $scope.question.answers.push({
                correct: 0
            });
        };

        $scope.saveQuestion = function() {
            var correct = false;
            if ($scope.quiz.type == 1) {
                angular.forEach($scope.question.answers, function(a) {
                    if (a.correct == 1) {
                        correct = true;
                    }
                });

            } else {
                correct = true;
            }
            if (!correct) {
                FlashService.show('Sie müssen eine korrekte Antwort festlegen!', '', 'danger');
                return;
            }
            if ($scope.question.id) {
                Quiz.updateQuestion({
                    quizId: $scope.quiz.id,
                    typeId: $scope.question.id
                }, $scope.question, function(data) {
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                        $scope.questionModal.hide();
                    } else {
                        FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                    }
                })
            } else {
                Quiz.createQuestion({
                        quizId: $scope.quiz.id
                    },
                    $scope.question,
                    function(data) {
                        if (data.status == true) {
                            if (typeof $scope.quiz.questions == "undefined") {
                                $scope.quiz.questions = [];
                            }
                            data.question.answers = JSON.parse(data.question.answers);
                            $scope.quiz.questions.push(data.question);
                            FlashService.show(data.message, '', 'success');
                            $scope.questionModal.hide();
                        } else {
                            FlashService.show('Speichern fehlgeschlagen!', '', 'danger');
                        }
                    });
            }
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



        var uploader = $scope.uploader = new FileUploader({
            url: 'http://www.openscience.or.at/assets/ajax/uploadImages.php',
            alias: 'qqfile',
            queueLimit: 20
        });
        uploader.formData = [{
            cat: 'quiz',
            id: 'new'
        }];
        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            //console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            uploader.formData[0].id = $scope.quiz.id || 'new';
            fileItem.formData[0].id = $scope.quiz.id || 'new';

        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if ($scope.uploadMultiple) {
                $scope.images.push(response.image);
            } else {
                $scope.image = response.image;
            }

        };
        $scope.openImagesModal = function(multiple) {
            uploader.clearQueue();
            $scope.images = [];
            $scope.image = {};
            $scope.uploadMultiple = multiple;
            if (!multiple) {
                uploader.queueLimit = 1;
                $scope.image.id = 0;
            } else {
                uploader.queueLimit = 20;
            }
            $scope.uploadImagesModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/uploadImages.html',
                show: false
            });
            $scope.uploadImagesModal.$promise.then($scope.uploadImagesModal.show);
        };
        $scope.deleteImage = function() {
            delete $scope.quiz.image;
            $scope.quiz.image_id = 0;
        };
        $scope.addImages = function(isValid) {
            $scope.quiz.image = $scope.image;
            $scope.quiz.image_id = $scope.image.id;
            $scope.image = {};
            $scope.uploadImagesModal.hide();
        };
    });