/**
 * @fileOverview A set of polyfills for running tests under PhantomJS.
 *
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
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

(function() {
    /* PhantomJS somehow caches references to native-code global functions if they
     * are called more than once without change. Spying on calls to these functions
     * is then impossible, as the code under test always calls the originals
     * rather than the spies that replace them.
     *
     * Details (which suggests this will be fixed in PhantomJS 2.0):
     * https://github.com/ariya/phantomjs/issues/11364
     *
     * Somehow, assigning the window functions we need to spy on to themselves
     * is enough to break the caching behaviour.
     */
    window.addEventListener = window.addEventListener;
    window.removeEventListener = window.removeEventListener;
    window.getComputedStyle = window.getComputedStyle;

    Function.prototype.bind = Function.prototype.bind || function (thisObj) {
        var self = this;
        return function() {
            return self.apply(thisObj);
        };
    };

    window.CustomEvent = window.CustomEvent || function (eventType) {
        var event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventType);
        return event;
    };

    window.HTMLMediaElement = window.HTMLMediaElement || {
        NETWORK_EMPTY: 0,
        NETWORK_IDLE: 1,
        NETWORK_LOADING: 2,
        NETWORK_NO_SOURCE: 3
    };
})();