'use strict';

/**
 * @ngdoc function
 * @name osApp.controller:NewsletterCtrl
 * @description
 * # NewsletterCtrl
 * Controller of the osApp
 */
angular.module('osApp')
    .controller('NewsletterCtrl', function($scope, $state, $timeout, $document, $stateParams, $modal, $aside, FlashService, Newsletter, Article) {
        function gup(name, url) {
            if (!url) url = location.href
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(url);
            return results == null ? null : results[1];
        }
        $scope.status = 'loading';
        $scope.colors = [{
            name: 'normal',
            title: 'Standard'
        }, {
            name: 'os',
            title: 'OpenScience'
        }, {
            name: 'wissen',
            title: 'Wissen'
        }, {
            name: 'projekte',
            title: 'Projekte'
        }, {
            name: 'schulcorner',
            title: 'Schulcorner'
        }, {
            name: 'vol',
            title: 'Vienna Open Lab'
        }];
        $scope.color = {
            'wissen': '523C7C',
            'schulcorner': '858D1E',
            'projekte': '1DA9C7',
            'vol': 'A31031'
        };
        $scope.overview = [];
        if ($stateParams.id != "new") {
            $scope.newsletter = Newsletter.get({
                newsId: $stateParams.id
            }, function() {
                $scope.campaign = Newsletter.campaign({
                    id: $scope.newsletter.mailchimp_id
                }, function(response) {
                    $scope.newsletter.mailchimp = response.data[0];

                    if ($scope.newsletter.content_data == '' && $scope.newsletter.mailchimp.status != 'sent') {

                        if (typeof $scope.newsletter.items == "undefined") {
                            $scope.newsletter.items = [];
                        }
                        $($scope.newsletter.content).children().children().each(function(key, value) {
                            $(value).find('.sort').each(function(k, item) {
                                var i = {};
                                var size = $(item).attr('data-width');
                                if (size == 1) {
                                    size = 0;
                                }
                                if ($(item).hasClass('text')) {
                                    i = {
                                        text: $(item).children().html(),
                                        size: size,
                                        type: {
                                            name: 'text',
                                            intern: 'additional',
                                            'class': '',
                                            'typClass': 'text'

                                        }
                                    };
                                    $scope.newsletter.items.push(i);

                                } else if ($(item).hasClass('header')) {

                                    i = {
                                        title: $(item).find('div').text(),
                                        size: size,
                                        type: {
                                            name: 'header',
                                            intern: 'additional',
                                            'class': '',
                                            'typClass': 'title'
                                        },
                                    };
                                    $scope.newsletter.items.push(i);

                                } else {
                                    var id = $(item).attr('data-id');
                                    Article.get({
                                        articleId: id
                                    }, function(data) {
                                        i = {
                                            id: data.id,
                                            title: data.title, //art.title,
                                            categorie: data.categorie.title,
                                            image: data.image,
                                            intro: data.intro || data.text.substring(0, data.text.indexOf('.') + 1),
                                            size: 0,
                                            type: {
                                                name: '', //art.type,
                                                intern: 'articles',
                                                'class': data.section.name, //art.section.name,
                                                'typClass': 'article'

                                            }
                                        };
                                        $scope.newsletter.items.push(i);
                                    });

                                }

                            });
                            FlashService.show('Newsletter Inhalt wurde vom alten System konvertiert!', 'Elemente müssen eventuell neu positioniert werden', 'warning', 10);
                        });
                    }
                });
            });
        } else {
            $scope.newsletter = {
                status: 'create'
            };
            $scope.newsletter.items = [];
        }
        $scope.list = Newsletter.list();
        $scope.$watchCollection('newsletter.mailchimp', function(newItem, oldItem) {
            if (newItem == oldItem) {
                return;
            } else {
                $scope.status = newItem.status;
            }
        });

        function scrollBottom() {
            $timeout(function() {
                $('.full-fixed').animate({
                    scrollTop: ($('#newsletter-box').height())
                }, 250);
                //  console.log($('.full-fixed').height());
            });
        };
        $scope.openArticlesModal = function() {
            if ($scope.overview.length == 0) {
                $scope.overview = Article.overview({
                    images: true
                });
            }
            $scope.articlesModal = $aside({
                scope: $scope,
                template: 'views/admin/modal/articles_drop.html'
            });
        };
        $scope.toggleSortFilter = function(sec) {
            if ($scope.sortFilter == sec) {
                $scope.sortFilter = '';
            } else {
                $scope.sortFilter = sec;
            }

        };

        $scope.addTitle = function() {
            $scope.addingTitle = true;
            $scope.newTitle = {};
            $scope.titleModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/newsletter_title.html',
                show: false
            });
            $scope.titleModal.$promise.then(function() {
                $scope.titleModal.show();
            });
        };
        $scope.insertTitle = function(isValid) {
            if (isValid) {
                if ($scope.addingTitle) {
                    var item = {
                        title: $scope.newTitle.title,
                        type: {
                            name: 'header',
                            intern: 'additional',
                            'class': $scope.newTitle.type.class,
                            'typClass': 'title'
                        },
                        size: 3
                    };
                    if (typeof $scope.newsletter.items == "undefined") {
                        $scope.newsletter.items = [];
                    }
                    $scope.newsletter.items.push(item);
                    scrollBottom();
                }

                $scope.titleModal.hide();

            }
        };
        $scope.editTitle = function(item) {
            $scope.addingTitle = false;
            $scope.newTitle = item;
            $scope.titleModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/newsletter_title.html',
                show: false
            });
            $scope.titleModal.$promise.then(function() {
                $scope.titleModal.show();
            });
        };
        $scope.addText = function() {
            $scope.addingText = true;
            $scope.newText = {};
            $scope.textModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/newsletter_text.html',
                show: false
            });
            $scope.textModal.$promise.then(function() {
                $scope.textModal.show();
            });
        };
        $scope.editText = function(item) {
            $scope.addingText = false;
            $scope.newText = item;
            $scope.textModal = $modal({
                scope: $scope,
                template: 'views/admin/modal/newsletter_text.html',
                show: false
            });
            $scope.textModal.$promise.then(function() {
                $scope.textModal.show();
            });
        };
        $scope.insertText = function(isValid) {
            if (isValid) {
                if ($scope.addingText) {
                    var item = {
                        text: $scope.newText.text,
                        size: 3,
                        type: {
                            name: 'text',
                            intern: 'additional',
                            'class': $scope.newText.type.class,
                            'typClass': 'text',

                        }
                    };
                    if (typeof $scope.newsletter.items == "undefined") {
                        $scope.newsletter.items = [];
                    }
                    $scope.newsletter.items.push(item);
                    scrollBottom();
                }
                $scope.textModal.hide();

            }
        };

        $scope.deleteItem = function(index) {
            $scope.newsletter.items.splice(index, 1);
        };
        $scope.sizeUp = function(item) {
            if (item.size < 3)
                item.size++;
        };
        $scope.sizeDown = function(item) {
            if (item.size > 0)
                item.size--;
        };
        $scope.toggleArticle = function(art) {

            if (typeof $scope.newsletter.items == "undefined") {
                $scope.newsletter.items = [];
            }
            var found = false;
            angular.forEach($scope.newsletter.items, function(item, key) {
                if (art.type == item.type.name && art.id == item.id) {
                    $scope.newsletter.items.splice(key, 1);
                    found = true;

                }
            });
            console.log(art);
            if (!found) {
                if (art.type == 'class') {
                    var cat = "Kurs/Seminar";
                    var catname = "kurse";
                    if (art.section.title == "Summercamp") {
                        cat = "Summer Science Camp";
                        catname = "summer-science-camps";
                    } else if (art.section.title == "Seminare") {
                        catname = "seminare";
                    }
                    var item = {
                        id: art.id,
                        title: art.title,
                        name: art.name,
                        categorie: cat,
                        cat: catname,
                        image: art.image,
                        intro: art.intro || art.text.substring(0, art.text.indexOf('.') + 1),
                        section: "vol",
                        size: 0,
                        type: {
                            name: art.type,
                            intern: 'articles',
                            'class': art.section.name,
                            'typClass': 'article'

                        }
                    };
                } else if (art.type == 'article') {
                    var item = {
                        id: art.id,
                        title: art.title,
                        name: art.name,
                        categorie: art.categorie.title,
                        cat: art.categorie.name,
                        image: art.image,
                        section: art.section.name,
                        intro: art.intro || art.text.substring(0, art.text.indexOf('.') + 1),
                        size: 0,
                        type: {
                            name: art.type,
                            intern: 'articles',
                            'class': art.section.name,
                            'typClass': 'article'

                        }
                    };
                }
                $scope.newsletter.items.push(item);
                scrollBottom();
            }

        };


        $scope.saveNewsletter = function(isValid) {
            $scope.loading(true, 'Newsletter wird gespeichert...');
            var table = $('<table id="main-content"></table>');
            var columns = 0;
            var row = $('<tr></tr>');
            var pos = 0;
            var i = null;
            angular.forEach(angular.element(".newsletter-toconvert > div"), function(value, key) {
                var item = angular.element(value).clone();
                item.find('.newsletter-edit-menu').remove();
                item.removeAttr('ng-class');
                item.removeAttr('ng-repeat');
                item.removeAttr('ng-if');
                item.removeAttr('as-sortable-item');
                // var cont = item.html().replace(/<!--[^(-->)]+-->/g, '');
                var td = $('<td></td>');
                if (item.hasClass('text')) {
                    item.find('h2').wrap('<a target="_blank" href="http://www.openscience.or.at"></a>');
                }
                td.append(item);

                if (item.hasClass('col-md-12')) {
                    td.attr('width', '720')
                    td.attr('colspan', 6);
                    table.append(row);
                    row = $('<tr></tr>');
                    columns += 6;
                } else if (item.hasClass('col-md-8')) {
                    td.attr('width', '540')
                    td.attr('colspan', 4);
                    columns += 4;
                } else if (item.hasClass('col-md-6')) {
                    td.attr('width', '360')
                    td.attr('colspan', 3);
                    columns += 3;
                } else if (item.hasClass('col-md-4')) {
                    td.attr('width', '240')
                    td.attr('colspan', 2);
                    columns += 2;
                }

                //  item.removeClass('col-md-12 col-md-8 col-md-6 col-md-4');
                if (columns > 0) {
                    row.append(td);
                }

                if (columns >= 6) {

                    table.append(row);
                    row = $('<tr></tr>');
                    columns = 0;
                    pos = key + 1;
                }
                i = item;
            });
            /* if (pos != angular.element(".newsletter-toconvert > div").length) {

                 i.find('.newsletter-edit-menu').remove();
                 // var cont = item.html().replace(/<!--[^(-->)]+-->/g, '');
                 var td = $('<td></td>');
                 td.append(i);

                 if (i.hasClass('col-md-12')) {
                     td.attr('width', '100%')
                     td.attr('colspan', 6);

                 } else if (i.hasClass('col-md-8')) {
                     td.attr('width', '75%')
                     td.attr('colspan', 4);

                 } else if (i.hasClass('col-md-6')) {
                     td.attr('width', '50%')
                     td.attr('colspan', 3);

                 } else if (i.hasClass('col-md-4')) {
                     td.attr('width', '33.33%')
                     td.attr('colspan', 2);

                 }
                 row.append(td);

                 table.append(row);

             }*/
            //var fbRow = $('<tr><td id="social-column" colspan="2" style="text-align:center"><a href="https://www.facebook.com/pages/Mascha-Seethaler/678185975581197?fref=ts" style="margin-top:8px;color: #8b8a8b !important;padding: 20px 0;display: inline-block;background: #fff;width: 98%;"><img src="http://www.architects.co.at/images/fb_icon.jpg"/>&nbsp;<span style="color: #8b8a8b;padding:5px;position:relative;top:-5px;"> be a fan on facebook</span></a></td><tr>')
            //table.append(fbRow);
            /*if (isValid) {
                Mailchimpadmin.campaignUpdate({
                    id: $scope.campaign.id
                }, {
                    content: '<center><table cellspacing="0" cellpadding="0" width="100%"  border="0" style="border-spacing: 0;"><tbody><tr><td align="center" valign="top" style="border-collapse: collapse;"><table id="main-content" width="800" cellspacing="0" cellpadding="0" valign="top" align="center">' + table.html().replace(/<!--[^(-->)]+-->/g, '') + "</table></td></tr></tbody></table></center>",
                    data: JSON.stringify($scope.newsletter.items),
                    title: $scope.campaign.title,
                    subject: $scope.campaign.subject,
                    from_name: $scope.campaign.from_name,
                    from_email: $scope.campaign.from_email,
                    image_id: $scope.campaign.local.image_id,
                    status: $scope.campaign.status,
                    list_id: $scope.campaign.list_id,
                    online_at: $scope.campaign.local.online_at
                }, function(response) {
                    if (response.errors.length == 0) {
                        FlashService.show('Speichern erfolgreich!', 'Der Inhalt wurde erfolgreich gespeichert', 'success');
                    } else {
                        FlashService.show('Speichern fehlgeschlagen!', 'Der Inhalt konnte nicht gespeichert werden!', 'danger');
                    }
                });
            }*/
            /*  Newsletter.config({
                  action: 'newsletterstyle'
              }, function(data) {
                  var html = '<style type="text/css">' + data.value + '</style>';
                  html += '<center><table cellspacing="0" cellpadding="0" width="100%"  border="0" style="border-spacing: 0;"><tbody><tr><td align="center" valign="top" style="border-collapse: collapse;"><table id="main-content" width="722" cellspacing="0" cellpadding="0" valign="top" align="center">' + table.html().replace(/<!--[^(-->)]+-->/g, '') + "</table></td></tr></tbody></table></center>";
                  var myWindow = window.open('', 'LetterTest', "width=800,height=800,toolbar=yes,scrollbars=yes");
                  myWindow.document.write(html);
              });*/
            if ($scope.newsletter.id) {
                Newsletter.update({
                    id: $scope.newsletter.mailchimp_id
                }, {
                    list_id: $scope.newsletter.list_id,
                    subject: $scope.newsletter.title,
                    content: table.html().replace(/<!--[^(-->)]+-->/g, ''),
                    newsletter: $scope.newsletter
                }, function(data) {
                    $scope.loading(false);
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                    } else {
                        FlashService.show('Fehler beim speichern des Newsletters!', '', 'danger');
                    }
                })
            } else {
                Newsletter.createChimp({
                    list_id: $scope.newsletter.list_id,
                    subject: $scope.newsletter.title,
                    content: table.html().replace(/<!--[^(-->)]+-->/g, ''),
                    newsletter: $scope.newsletter
                }, function(data) {
                    $scope.loading(false);
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                        $state.go('newsletter', {
                            id: data.newsletter.id
                        });
                    } else {
                        FlashService.show('Fehler beim speichern des Newsletters!', '', 'danger');
                    }
                });
            }


        };
        $scope.sendTest = function() {
            $scope.test = {};
            $scope.emailModal = $modal({
                template: "views/admin/modal/email.html",
                scope: $scope,
                show: false
            });
            $scope.emailModal.$promise.then(function() {
                $scope.emailModal.show();
            });
        };
        $scope.submitTest = function(isValid) {
            if (isValid) {
                $scope.loading(true, 'Testmail wird versendet');
                $scope.emailModal.hide();
                Newsletter.sendTest({
                    action: $scope.newsletter.mailchimp_id
                }, {
                    'email': $scope.test.email
                }, function(data) {
                    $scope.loading(false);
                    if (data.status == true) {

                        FlashService.show(data.message, '', 'success');
                        $scope.newsletter.mailchimp.tests_remain--;
                    } else {
                        FlashService.show('Fehler beim senden der Testmail', '', 'danger');
                    }
                });
            }
        };
        $scope.showPreview = function() {

        };
        $scope.sendCampaign = function() {
            $scope.loading(true, 'Newsletter wird versendet...');
            if (confirm("Newsletter:\n" + $scope.newsletter.title + "\njetzt senden?")) {
                Newsletter.sendCampaign({
                    action: $scope.newsletter.mailchimp_id
                }, {}, function(data) {
                    $scope.loading = false;
                    if (data.status == true) {
                        FlashService.show(data.message, '', 'success');
                        $state.go('newsletters');
                    } else {
                        FlashService.show('Fehler beim absenden des Newsletters', '', 'danger');
                    }
                });
            }
        };
        $scope.loading = function(show, msg) {
            if (show) {
                $scope.msg = msg;
                $scope.loadingModal = $modal({
                    template: 'views/admin/modal/loading.html',
                    scope: $scope,
                    show: false,
                    placement: 'center',
                    backdrop: 'static'
                });
                $scope.loadingModal.$promise.then(function() {
                    $scope.loadingModal.show();
                });
            } else {
                $scope.loadingModal.hide();
            }
        };
    });