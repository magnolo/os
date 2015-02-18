/*
 * Thesaurus
 *
 * @package thesaurus
 * @author sheiko
 * @version jquery.thesaurus.js, v 4.0
 * @license GNU
 * @copyright (c) Dmitry Sheiko http://dsheiko.com
 */

(function($) {
    var VERSION = "4.0b",
        TPL_TAG_OPEN = '~~',
        TPL_TAG_CLOSE = '~~',
        ESCAPERS = '[\\s!;,%\"\'\\(\\)\\{\\}]',
        SERVER_LOC = 'http://www.openscience.or.at/assets/lib/thesaurus4/server.php',
        UNAPPROPRIATE_TAGS = ['SCRIPT', 'BASE', 'LINK', 'META', 'STYLE', 'TITLE', 'APPLET', 'OBJECT'],
        CSS_TPL = '',
        TOOLTIP_TPL = '<div class="thesaurus"><div class="thesaurus-canvas"><div class="thesaurus-header"><a class="term"></a></div><div class="thesaurus-body">wird geladen...</div></div></div>',
        TOOLTIP_HIDE_TIMEOUT = 100,
        PUSH_TIMEOUT = 5000,
        thesaurusInstance = null,
        Repository = { // Global repository
            termsDef: {}, // Cache of term definitions
            targetId: 0
        },
        /**
         * Thesaurus Data Access Object
         */
        DAO = {
            /**
             * Encode strings with spaces correctly
             * @param string text
             */
            _urlEncode: function(text) {
                return encodeURIComponent(text.replace(/ /g, "+"));
            },
            /**
             * Makes a JSONP request to server
             * @param string action
             * @param string term
             * @param boolean caseSensitive
             * @param function callback
             */
            request: function(action, data, callback) {
                console.log('fetching');
                $.ajax({
                    url: SERVER_LOC + "?action=" + action + (typeof data.term !== "undefined" ? "&term=" + DAO._urlEncode(data.term) : "") + (typeof data.stats !== "undefined" ? "&stats=" + DAO._urlEncode(data.stats) : "") + (typeof data.caseSensitive !== "undefined" ? "&caseSensitive=" + (data.caseSensitive * 1) : ""),
                    success: callback,
                    dataType: 'json'
                })
                //$.getScript(SERVER_LOC + "?action=" + action + (typeof data.term !== "undefined" ? "&term=" + DAO._urlEncode(data.term) : "") + (typeof data.stats !== "undefined" ? "&stats=" + DAO._urlEncode(data.stats) : "") + (typeof data.caseSensitive !== "undefined" ? "&caseSensitive=" + (data.caseSensitive * 1) : ""), callback);
            }
        }
        /**
         * Statistics collector
         */
    var Stats = function() {
        var _termViews = {},
            _pushCb = function() {
                if (Object.keys(_termViews).length) {
                    DAO.request("onview", {
                        'stats': JSON.stringify(_termViews)
                    }, function() {
                        _termViews = {};
                    });
                }
            };
        return {
            establishServerPushConnection: function() {
                window.setInterval(_pushCb, PUSH_TIMEOUT);
                $(window).unload(_pushCb);
            },
            /**
             * Collect term view stats, which can be pushed to the server with session close
             * @param string term
             */
            incrementTermViews: function(term) {
                term = (term + "").toLowerCase();
                _termViews[term] = typeof _termViews[term] === "undefined" ? 1 : _termViews[term] + 1;
            },
            /**
             * Collect term click stats
             * @param string term
             */
            incrementTermClicks: function(term) {
                DAO.request("onclick", {
                    'term': term
                });
            }
        }
    };
    /**
     * Tooltip manager
     * @param Tooltip parent - the link to the parent tooltip if one exists
     */
    var Tooltip = function(parent) {
        var _settings = thesaurusInstance.getSettings(),
            _statsInstance = thesaurusInstance.getStatsInstance(),
            _parent = parent,
            _boundingBox = null,
            _hideTimer = null,
            _id = 0,
            /**
             * Adjusts position (top/left) of the tooltip overlay relatively to term element
             */
            _adjustPositionByTarget = function(targetEl) {
                var top = targetEl.offset().top - 5 - _boundingBox.height(),
                    left = targetEl.offset().left + targetEl.width() / 2,
                    canvas = _boundingBox.find(' > .thesaurus-canvas');

                canvas.removeClass('upwards').removeClass('downwards')
                    .removeClass('leftwards').removeClass('rightwards');

                if (top < $(window).scrollTop()) {
                    top = targetEl.offset().top + targetEl.height() + 5;
                    canvas.addClass('downwards');
                } else {
                    canvas.addClass('upwards');
                }

                if (left > $(window).width() - _boundingBox.width()) {
                    left = targetEl.offset().left - _boundingBox.width() + targetEl.width() / 2;
                    canvas.addClass('leftwards');
                } else {
                    canvas.addClass('rightwards');
                }
                _boundingBox
                    .css("top", Math.floor(top))
                    .css("left", Math.floor(left))
            },
            /**
             * Fetches definitiion of the provided term by XMLHttpRequest or from cache
             */
            _fetchDefinition = function(term, callback) {
                if (typeof Repository.termsDef[term] !== "undefined") {
                    callback(Repository.termsDef[term]);
                    return;
                }
                DAO.request("termDef", {
                    'term': term,
                    'caseSensitive': _settings.caseSensitive
                }, function() {
                    Repository.termsDef[term] = $.callbackData.payload;
                    callback(Repository.termsDef[term]);
                });
            },
            /**
             * Assigns CSS3 transition effect, if any specified
             * @param string state
             */
            _setTransitionState = function(state) {
                if (_settings.effect) {
                    _boundingBox.addClass('thesaurus-' + _settings.effect + '-' + state);
                }
            };
        return {
            /**
             * Subscribes handlers on hover events on the terms elements in DOM
             */
            syncUI: function(nodes) {
                nodes.find('dfn.thesaurus').unbind().bind("mouseenter", this, function(e) {
                    e.data.show($(this));
                }).bind('mouseleave', this, function(e) {
                    e.data.hide();
                });
            },
            /**
             * Subscribes handlers on events within tooltip overlay
             * @param string term
             */
            syncOverlayUI: function(term) {
                _boundingBox.unbind().bind("mouseenter", this, function(e) {
                    e.data.cancelHiding();
                }).bind('mouseleave', this, function(e) {
                    e.data.hide();
                }).bind('click', this, function() {
                    _statsInstance.incrementTermClicks(term);
                })
            },
            /** 
             * Renders tooltip overlay
             * @param jQuery Node
             **/
            show: function(targetEl) {
                var term = targetEl.text(),
                    id = targetEl.data('id'),
                    scope = this;

                _statsInstance.incrementTermViews(term);

                // Happens when mouse cursor moves from overlay to the target link
                if (id && _id === id && _boundingBox.hasClass('thesaurus-visible')) {
                    this.cancelHiding();
                    return;
                }
                if (typeof id === "undefined") {
                    targetEl.data('id', _id = ++Repository.targetId);
                }
                $(_boundingBox).remove();
                // Renders tooltip with Loading...
                _boundingBox = $(TOOLTIP_TPL).appendTo('body');
                _boundingBox.find('a.term').text(term);
                // IE 8 supports :after CSS pseudo-property, buut doesn't transporent border-color
                // if ($.browser.msie && Math.floor($.browser.version) < 10) {
                //   _boundingBox.find(' > .thesaurus-canvas').removeClass('thesaurus-canvas');
                //}
                _boundingBox
                    .addClass('thesaurus-visible');
                _setTransitionState('start');


                this.syncOverlayUI(term);

                _adjustPositionByTarget(targetEl);
                // Fetches and appends definition text into the tooltip
                _fetchDefinition(term, function(def) {
                    thesaurusInstance.run(
                        _boundingBox.find('div.thesaurus-body').html(def), scope);
                    _adjustPositionByTarget(targetEl);
                });
                _setTransitionState('end');
            },
            /**
             * Cancel destroying
             */
            cancelHiding: function() {
                window.clearTimeout(_hideTimer);
                if (typeof _parent !== 'undefined') {
                    _parent.cancelHiding();
                }
            },
            /**
             * Destroys tooltip overlay defferedly
             */
            hide: function() {
                if (typeof _parent !== 'undefined') {
                    _parent.hide();
                }
                window.clearTimeout(_hideTimer);
                _hideTimer = window.setTimeout(function() {
                    _boundingBox
                        .removeClass('thesaurus-visible').remove();
                }, TOOLTIP_HIDE_TIMEOUT);
            }
        }
    };

    /**
     * Plugin's manager
     */
    var Thesaurus = function(settings) {
        var _settings = $.extend({
                caseSensitive: false,
                effect: null,
                pushStats: false
            }, settings),
            _terms = {},
            _statsInstance = new Stats(),
            /**
             * Since I know no way to insert an ElementNode into a TextNode, here the found term
             * is marked with special text tags, to be found and replaced aftewards within DOM
             *
             * @param string line
             * @param string term
             */
            _markTermInTextNodeText = function(line, term) {
                var modifier = _settings.caseSensitive ? "g" : "gi";
                // Only term in nodeValue
                if (term == line) {
                    return TPL_TAG_OPEN + line + TPL_TAG_CLOSE;
                }
                //term" ....
                var re = new RegExp("^(" + term + ")(" + ESCAPERS + ")", modifier);
                line = line.replace(re, TPL_TAG_OPEN + "$1" + TPL_TAG_CLOSE + "$2");
                //... "term
                re = new RegExp("(" + ESCAPERS + ")(" + term + ")$", modifier);
                line = line.replace(re, "$1" + TPL_TAG_OPEN + "$2" + TPL_TAG_CLOSE);
                // .. "term" ..
                re = new RegExp("(" + ESCAPERS + ")(" + term + ")(" + ESCAPERS + ")", modifier);
                line = line.replace(re, "$1" + TPL_TAG_OPEN + "$2" + TPL_TAG_CLOSE + "$3");
                return line;
            },
            /**
             * Mark terms in TextNodes of the given parent nodes
             * @param jQuery nodes
             */
            _markTermsInDOM = function(nodes) {
                nodes.contents().filter(function() {
                    // If it is an element, look for text nodes inside recursively
                    if (this.nodeType === 1) {
                        _markTermsInDOM($(this));
                    }
                    // Only not empty text nodes
                    return this.nodeType === 3 && $.trim($(this).text()).length && $.inArray(this.tagName, UNAPPROPRIATE_TAGS) === -1;
                })
                    .each(function() {
                        var node = this;
                        $.each(_terms, function(id, term) {
                            node.nodeValue = _markTermInTextNodeText(node.nodeValue, term);
                        })
                    });
            },
            /**
             * Turn found terms into elements responsible to hover event
             * @param jQuery nodes
             */
            _wrapTermsInDOM = function(nodes) {
                nodes.find('script').detach();
                nodes.html(function(inx, html) {
                    var re = new RegExp(TPL_TAG_OPEN + "(.*?)" + TPL_TAG_OPEN, 'g');
                    return html.replace(re, '<dfn class=\"thesaurus\">$1</dfn>');
                });
            };

        return {
            init: function(callback) {
                if (_settings.pushStats) {
                    _statsInstance.establishServerPushConnection();
                }
                this.renderUI();
                this.loadTerms(callback);
                return this;
            },
            run: function(nodes, parent) {
                _markTermsInDOM(nodes);
                _wrapTermsInDOM(nodes);
                var tooltipInstance = new Tooltip(parent)
                tooltipInstance.syncUI(nodes);
            },
            /**
             * Loads terms map {id : term} from the data source
             * @param function callback
             */
            loadTerms: function(callback) {
                var scope = this;
                console.log('thes');
                DAO.request("termList", {}, function(response) {
                    console.log(response);
                    _terms = response.playload;

                    callback.call(scope);
                });
            },
            /**
             * Adding Thesaurus stylesheet into DOM
             */
            renderUI: function() {
                // Append CSS
                $('body').append('<style type="text/css">' + CSS_TPL + '</style>');
            },
            /**
             * Public accessor
             */
            getSettings: function() {
                return _settings;
            },
            /**
             * Public accessor
             */
            getStatsInstance: function() {
                return _statsInstance;
            }

        }
    };
    /**
     * @param object settings
     * @param Thesaurus parent - required only when Thesaurus instatiated to parse tooltip's content
     */
    $.fn.Thesaurus = function(settings) {
        var nodes = $(this);
        if (thesaurusInstance === null) {
            thesaurusInstance = new Thesaurus(settings);
            thesaurusInstance.init(function() {
                thesaurusInstance.run(nodes);
            });
        } else {
            thesaurusInstance.run(nodes);
        }
    };


}(jQuery));