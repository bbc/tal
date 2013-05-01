/**
 * @fileOverview Requirejs module containing base antie.Historian class.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def("antie/historian",
    [
        "antie/class"
    ],
    function(Class) {
        'use strict';
        var Historian = Class.extend({
            init: function(currentUrl) {
                var self = this;
                
                function splitHistoryToArray() {
                    var i;
                    self._historyArray = self._currentUrl.split(Historian.HISTORY_TOKEN);
                    self._historyArray.shift(); // dump non-history portion of url
                    for(i = 0; i !== self._historyArray.length; i += 1) {
                        self._historyArray[i] =  Historian.HISTORY_TOKEN + self._historyArray[i];
                    }
                }
                
                this._currentUrl = currentUrl;
                splitHistoryToArray();
            },

            /**
             * Returns a URL to navigate back to the previous application
             * @returns {String} The first history item in currentUrl as a non-encoded URL, or the empty string if there is no history.
             */
            back: function() {
                var recent, remaining, fragmentSeparator, self;
                self = this;
                
                function findRecentAndRemaining() {
                    var history = self._historyArray;
                    if (history.length > 0) {
                        recent = history[history.length - 1].split(Historian.HISTORY_TOKEN)[1];
                        remaining = history.slice(0, history.length - 1).join("");
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
            forward: function(destinationUrl) {
                var fragmentSeparator, self;
                self = this;
                
                function routeInDestination() {
                    return (destinationUrl.indexOf('#') !== -1);
                }
                
                function replaceRouteInSource() {
                    if (self._currentUrl.indexOf('#') !== -1) {
                        self._currentUrl = self._currentUrl.replace('#', Historian.ROUTE_TOKEN);
                    }
                }
                
                if (this._currentUrl === '') {
                    return destinationUrl;
                }
                
                replaceRouteInSource();
                fragmentSeparator = routeInDestination() ? '' : '#';
                return destinationUrl + fragmentSeparator + Historian.HISTORY_TOKEN + self._currentUrl;
            },

            /**
             * Returns a string representation of the current history stack. This is not useful externally.
             * @returns {String} A string representing the current history stack, to be appended to the current route within the application.
             */
            toString: function() {
                return this._historyArray.join("");
            }            
        });
        
        Historian.HISTORY_TOKEN = '&history=';
        Historian.ROUTE_TOKEN = '&route=';
        
        return Historian;
    }
);