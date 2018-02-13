/**
 * @fileOverview Requirejs module containing base antie.historian class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/historian',
    [
        'antie/class'
    ],
    function(Class) {
        'use strict';

        // History stack is built up with most recent item at the FRONT (first), oldest items at the BACK (last).
        var Historian = Class.extend({
            /**
             * @constructor
             * @ignore
             */
            init: function init (currentUrl) {
                var i;

                this._historyArray = currentUrl.split(Historian.HISTORY_TOKEN);
                this._currentUrl = this._historyArray.shift(); // non-history portion of the URL
                for(i = 0; i !== this._historyArray.length; i += 1) {
                    this._historyArray[i] =  Historian.HISTORY_TOKEN + this._historyArray[i];
                }
            },

            /**
             * Returns a URL to navigate back to the previous application
             * @returns {String} The first history item in currentUrl as a non-encoded URL, or the empty string if there is no history.
             */
            back: function back () {
                var recent, remaining, fragmentSeparator, self;
                self = this;

                function findRecentAndRemaining() {
                    var history = self._historyArray;
                    if (history.length > 0) {
                        recent = history[0].split(Historian.HISTORY_TOKEN)[1];
                        remaining = history.slice(1, history.length).join('');
                    } else {
                        recent = remaining = '';
                    }
                }

                function processRoute() {
                    if(recent.indexOf(Historian.ROUTE_TOKEN) !== -1) {
                        fragmentSeparator = '';
                        recent = recent.replace(Historian.ROUTE_TOKEN, '#');
                    }
                }

                function buildBackUrl() {
                    if(remaining) {
                        return recent + fragmentSeparator + remaining;
                    }
                    return recent;
                }

                fragmentSeparator = '#';
                findRecentAndRemaining();
                processRoute();
                return buildBackUrl();
            },

            /**
             * Returns a URL that allows navigation to the destination url while preserving history.
             * @param {String} destinationUrl, The non uri-encoded destination url including route fragment if applicable.
             * @returns {String} A non encoded uri with history information appended, the exact format of this is subject to change and should not be depended upon.
             */
            forward: function forward (destinationUrl) {
                var fragmentSeparator, self;
                self = this;

                function isRouteInDestination() {
                    return (destinationUrl.indexOf('#') !== -1);
                }

                function replaceRouteInSource() {
                    if (self._currentUrl.indexOf('#') !== -1) {
                        self._currentUrl = self._currentUrl.replace('#', Historian.ROUTE_TOKEN);
                    }
                }

                function addCurrentUrlToHistory() {
                    self._historyArray.unshift(Historian.HISTORY_TOKEN + self._currentUrl);
                }

                // Some devices have a de facto URL length limit of around 1000 characters, so trim URL by dropping history elements.
                // Keep the oldest history entry - drop oldest items from the middle.
                function trimUrlHistoryToLength() {
                    while (self._historyArray.length > 1 && self.toString().length + destinationUrl.length > 999) {
                        self._historyArray.splice(-2, 1);
                    }
                }

                if (this._currentUrl === '') {
                    return destinationUrl;
                }

                replaceRouteInSource();
                addCurrentUrlToHistory();
                trimUrlHistoryToLength();
                fragmentSeparator = isRouteInDestination() ? '' : '#';
                return destinationUrl + fragmentSeparator + this.toString();
            },

            /**
             * Returns a string representation of the current history stack. This is not useful externally.
             * @returns {String} A string representing the current history stack, to be appended to the current route within the application.
             */
            toString: function toString () {
                return this._historyArray.join('');
            },

            /**
             * Returns a Boolean to indicate whether the history stack contains valid return URLs. This excludes the 'return to broadcast' special case.
             * @returns {Boolean} True if the history stack contains one or more valid return URLs.
             */
            hasHistory: function hasHistory () {
                var historyMinimumLength = this.hasBroadcastOrigin() ? 2 : 1;
                return this._historyArray.length >= historyMinimumLength;
            },

            /**
             * Returns a Boolean to indicate whether the first entry in the history stack is the special 'broadcast' entry.
             * @returns {Boolean} True if the first entry in the history stack is the special 'broadcast' entry.
             */
            hasBroadcastOrigin: function hasBroadcastOrigin () {
                return this._historyArray.length > 0 && this._historyArray[this._historyArray.length - 1] === Historian.HISTORY_TOKEN + Historian.BROADCAST_ENTRY;
            }
        });

        Historian.HISTORY_TOKEN = '&*history=';
        Historian.ROUTE_TOKEN = '&*route=';
        Historian.BROADCAST_ENTRY = 'broadcast';

        return Historian;
    }
);
