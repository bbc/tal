/**
 * @fileOverview Requirejs module containing the antie.events.MediaSourceErrorEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/mediasourceerrorevent',
    ['antie/events/mediaerrorevent'],
    function(MediaErrorEvent) {
        'use strict';

        /**
         * Class of events raised when media error occur on a source
         * @name antie.events.MediaSourceErrorEvent
         * @class
         * @extends antie.events.MediaErrorEvent
         * @param {antie.widgets.Media} target The media widget that fired the event.
         * @param {Integer} code Error code.
         * @param {String} url URL of source which raised error.
         * @param {Boolean} last True if the source was the last source available.
         */
        var MediaSourceErrorEvent = MediaErrorEvent.extend(/** @lends antie.events.MediaSourceErrorEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (target, code, url, last) {
                this.url = url;
                this.last = last;

                init.base.call(this, target, code);
            }
        });

        return MediaSourceErrorEvent;
    }
);
