'use strict';

angular.module('osApp')
    .factory('Quiz', function($resource) {
        return $resource('http://www.openscience.or.at/api/quiz/:quizId/:type/:typeId/:action', {}, {
            query: {
                method: 'GET',
                params: {
                    quizId: ''
                },
                isArray: true
            },
            get: {
                method: 'GET'
            },
            answers: {
                method: 'GET',
                params: {
                    type: 'answers'
                }
            },
            update: {
                method: 'PUT',
                params: {

                }
            },
            create: {
                method: 'POST'
            },
            removeQuiz: {
                method: 'DELETE'
            },
            createQuestion: {
                method: 'POST',
                params: {
                    type: 'question'
                }
            },
            updateQuestion: {
                method: 'PUT',
                params: {
                    type: 'question'
                }
            },
            removeQuestion: {
                method: 'DELETE',
                params: {
                    type: 'question'
                }
            },
            sortQuestions: {
                method: 'PUT',
                params: {
                    action: 'sortquestions'
                }
            }
        });
    });