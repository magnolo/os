'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:SwfObject
 * @description
 * # SwfObject
 */
angular.module('osApp')
    .factory('SwfObject', ['$window', function($window) {
        return $window.swfobject;
    }])
    .directive('swfObject', ['$window', '$timeout', 'SwfObject', function($window, $timeout, SwfObject) {
        'use strict';
        return {
            restrict: 'EAC',
            template: '<div id="{{id}}" ng-transclude></div>',
            transclude: true,
            scope: {
                params: '=swfParams',
                attrs: '=swfAttrs',
                callbacks: '=swfCallbacks'
            },
            link: function link(scope, element, attrs) {
                scope.id = attrs.swfId ||
                    // Random hash looking thing
                    'swf-' + Math.floor(Math.random() * 1000000000000).toString(16);
                /*  $timeout(function() {
                      console.log(attrs);
                      SwfObject.embedSWF(attrs.swfUrl,
                          scope.id,
                          attrs.swfWidth || 700,
                          attrs.swfHeight || 580,
                          attrs.swfVersion || '10',
                          null,
                          null,
                          scope.params,
                          scope.attrs);
                  }, 0);*/
                attrs.$observe('swfUrl', function(value) {
                    if (value) {
                        console.log(value);
                        $timeout(function() {

                            SwfObject.embedSWF(value,
                                scope.id,
                                attrs.swfWidth || 700,
                                attrs.swfHeight || 580,
                                attrs.swfVersion || '10',
                                null,
                                null,
                                scope.params,
                                scope.attrs);
                        }, attrs.swfTimeout || 0);
                    }

                });
                if (scope.callbacks) {
                    var cbs = scope.callbacks;
                    var cbNames = Object.keys(cbs);
                    cbNames.forEach(function(cbName) {
                        $window[cbName] = cbs[cbName];
                    });
                }
            }
        };
    }]);