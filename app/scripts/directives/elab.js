'use strict';

/**
 * @ngdoc directive
 * @name osApp.directive:elab
 * @description
 * # elab
 */
angular.module('osApp')
    .directive('elab', function() {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                elab: '='
            },
            link: function(scope, element, attrs) {
                attrs.$observe('src', function(value) {
                    if (value) {
                        element.html(
                            '<object width="100%" type="application/pdf" data="' + value + '">' +
                            '<param value="http://www.openscience.or.at' + value + '" name="movie">' +
                            '<param name="quality" value="high" />' +
                            '<param name="bgcolor" value="#ffffff" />' +
                            '<param value="transparent" name="wmode">' +
                            '<param value="noscale" name="scale">' +
                            '<embed src="http://www.openscience.or.at' + value + '" quality="high" bgcolor="#ffffff" width="720" height="570"  align="middle" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" />' +
                            '</object>');
                    } else {
                        element.html("<div></div>"); // We have to put something into the DOM
                    }
                });
            }
        };
    });
