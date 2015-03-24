'use strict';

angular.module('osApp')
    .directive('updateTitle', function($rootScope, $timeout) {
        function capitalise(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }
        return {
            link: function(scope, element) {

                var listener = function(event, toState, toParams, fromState, fromParams) {
                    var title = 'OpenScience';
                    if (toState.data && toState.data.pageTitle) {
                        title = toState.data.pageTitle;
                    }
                    if (toParams.section) {
                        title = capitalise(toParams.section);
                        if (toParams.categorie) {
                            title = capitalise(toParams.categorie) + ' // ' + capitalise(toParams.section);
                            if (toParams.article) {
                                title = capitalise(toParams.article) + ' // ' + capitalise(toParams.categorie) + ' // ' + capitalise(toParams.section);
                            }
                        }
                    }
                    $timeout(function() {
                        element.text(title);
                    });
                };

                $rootScope.$on('$stateChangeStart', listener);
            }
        };
    }).directive('scrolltop', function() {
        return {
            link: function(scope, element) {
                element.on('click', function() {
                    $('html,body').animate({
                        scrollTop: 0
                    });
                });
            }
        }
    }).directive('scrollprev', function() {
        return {
            link: function(scope, element) {

                element.on('click', function() {
                    var offset = 0;
                    angular.forEach(scope.articles, function(article) {
                        if (article.name == scope.activeArticle) {
                            var index = scope.articles.indexOf(article);
                            if (index > 0) {
                                offset = $('#' + scope.articles[index - 1].name).offset().top - 70;
                            }
                        }
                    });
                    $('html,body').animate({
                        scrollTop: offset
                    });
                });
            }
        }
    }).directive('btnSwitch', function() {

        return {
            restrict: 'EAC',
            template: '<span class="boolean" ng-click="toggle()"><span class="btn on btn-success" ng-show="model == 1" style="width: 40px;text-align: center"><i class="fa fa-check"></i></span><span class="btn off btn-danger" ng-hide="model == 1" style="width: 40px;text-align: center"><i class="fa fa-times"></i></span></span>',
            replace: true,
            scope: {
                model: '=?ngModel'
            },
            link: function(scope) {
                scope.toggle = function() {
                    if (scope.model == 1) {
                        scope.model = 0
                    } else {
                        scope.model = 1;
                    }
                }
            }
        };
    }).directive('btnSwitchArray', function() {

        return {
            restrict: 'EAC',
            template: '<span class="boolean" ng-click="toggle()"><span class="btn on btn-success" ng-show="found()" style="width: 40px;text-align: center"><i class="fa fa-check"></i></span><span class="btn off btn-danger" ng-hide="found()" style="width: 40px;text-align: center"><i class="fa fa-times"></i></span></span>',
            replace: true,
            scope: {
                model: '=?ngModel',
                value: '=?ngValue'
            },
            link: function(scope) {
                scope.found = function() {
                    if (typeof scope.model == "undefined" || !scope.model) {
                        return false;
                    }
                    if (scope.model.indexOf(scope.value) > -1) {
                        return true;
                    }
                    return false;
                };
                scope.toggle = function() {
                    var found = false;
                    var index = 0;
                    //var model = JSON.parse(scope.model);
                    //  console.log(scope.model);
                    angular.forEach(scope.model, function(id, i) {
                        if (id == scope.value) {
                            found = true;
                            index = i;
                        }
                    });
                    if (found) {
                        scope.model.splice(index, 1);
                    } else {
                        scope.model.push(scope.value);
                    };
                    // scope.model = model;
                    //console.log(scope.model);
                }
            }
        };
    });