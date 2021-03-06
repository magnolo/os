/*global Sly */
'use strict';

angular.module('osApp')
    .directive('stick', function($document, $window, $timeout, $rootScope) {
        return {
            restrict: 'A',
            link: function postLink(scope, element) {
                var header = angular.element(document.getElementById('header'));
                var navigation = angular.element(document.getElementById('navigation'));
                var top = angular.element(document.getElementById('content_container'));
                var scrollbar = element.find('.scrollbar');
                var list = element.find('.items');
                var fMenu = element.find('.functions_menu');
                var container = element.find('#cat_articles');
                var isLoaded = false;
                var mainHeader = element.parent().parent().find('.article');

                /*console.log('---');
                console.log(header);
                console.log(navigation);
                console.log(top);
                console.log(scrollbar);
                console.log(list);
                console.log(fMenu);
                console.log(container);
                console.log(mainHeader);
                console.log('---');*/

                var sly = new Sly(list, {
                    //itemNav:'basic',
                    speed: 100,
                    smart: 1,
                    //easing: 'easeOutExpo',
                    // pagesBar: $wrap.find('.pages'),
                    activateOn: 'click',
                    activatePageOn: 'click',
                    scrollBar: element.find('.scrollbar'),
                    scrollBy: 100,
                    dragHandle: 1,
                    mouseDragging: 0,
                    touchDragging: 1,
                    dynamicHandle: 1,
                    clickBar: 1,
                    releaseSwing: true,
                    prev: angular.element(document.getElementById('articlesToPreview')),
                    keyboardNavBy: 'items'

                });
                sly.on('load', function() {
                    isLoaded = true;
                    //console.log('stick');
                });
                sly.on('move', function() {
                    $rootScope.$broadcast('slyscroll');
                });

                scope.checkPosition = function() {
                    if (isLoaded) {
                        $timeout(function() {
                            var item = element.find('.active');
                            var menu = element.find('.scroll_menu');
                            $timeout(function() {
                                if (item.position().top > menu.innerHeight() / 2) {
                                    sly.toEnd();
                                } else {
                                    sly.toStart();
                                }
                            }, 300);
                        });
                    }
                };
                scope.checkDim = function() {

                    var varscroll = parseInt($document.scrollTop());
                    var fMenuHeight = 0;
                    if (fMenu.length) {
                        fMenuHeight = fMenu.innerHeight();
                    }
                    if ($window.innerWidth > 960) {
                        if (varscroll > header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight()) {



                            element
                                .addClass('headroom--not-top')
                                .css({
                                    'transform': 'translateY(-' + (header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight()) + 'px)',
                                    '-webkit-transform': 'translateY(-' + (header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight()) + 'px)'

                                });


                            if ((container.innerHeight() + fMenuHeight + 50) > ($window.innerHeight - navigation.innerHeight() + 20)) {
                                list.css({
                                    'height': ($window.innerHeight - navigation.innerHeight() - 30 - fMenuHeight) + 'px'
                                });
                                scrollbar.css({
                                    'height': ($window.innerHeight - navigation.innerHeight() - 30 - fMenuHeight) + 'px'
                                });
                                if (isLoaded) {
                                    sly.reload();
                                } else {
                                    sly.init();
                                }
                                scrollbar.show();
                            } else {
                                isLoaded = false;
                                scrollbar.hide();
                                if (sly.initialized && typeof sly.frame != "undefined") {
                                    sly.destroy();
                                }
                            }

                        } else {
                            element
                                .removeClass('headroom--not-top')
                                .css({
                                    'transform': 'translateY(0px)',
                                    '-webkit-transform': 'translateY(0px)'
                                });

                            //sly.destroy();
                            //scrollbar.hide();
                        }
                    }
                    else{
                      list.css({
                          'height': ($window.innerHeight - navigation.innerHeight() - 41) + 'px'
                      });

                      /*$('#cat_articles').css({
                          'height': ($window.innerHeight - navigation.innerHeight() - 41) + 'px',
                      });
                    //  sly.init();
                      /*if (varscroll > header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight() +$('#smart').height()+ $('#smarter').height()-25) {
                          element
                          .addClass('headroom--not-top')
                          .css({
                              'transform': 'translateY(-' + (header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight() +$('#smart').height()+ $('#smarter').height()-15) + 'px)',
                              '-webkit-transform': 'translateY(-' + (header.innerHeight() - navigation.innerHeight() + top.innerHeight() - 20 + mainHeader.innerHeight() +$('#smart').height()+ $('#smarter').height()-15) + 'px)',
                              'z-index': 3
                          });

                          list.height(31);

                          //if(!sly.initialized){
                            sly.init();
                          //}
                          var active = list.find('li.active');
                          var pos = sly.getPos(active);
                          console.log(pos);
                          list.height(pos.size+1);
                          $('#cat_articles').css({
                            'transform': 'translateY(-'+pos.end+'px)',
                            '-webkit-transform': 'translateY(-'+pos.end+'px)'
                          });




                      }
                      else{
                        element
                            .removeClass('headroom--not-top')
                            .css({
                                'transform': 'translateY(0px)',
                                '-webkit-transform': 'translateY(0px)'
                            });
                            $('#meter').css({'height': ''});
                            $('#articles_container').css({
                              'margin-top': ''
                            });
                            sly.destroy();
                      }*/
                    }
                };
                $document.on('scroll', function() {
                    scope.checkDim();
                });
                scrollbar.hide();
                $timeout(function() {
                    scope.checkDim();
                });
                angular.element($window).bind('resize', function() {
                    scope.checkDim();
                    //sly.reload();
                });
                //sly.init();
            }
        };
    });
