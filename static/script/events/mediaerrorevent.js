/**
 * @fileOverview Requirejs module containing the antie.events.MediaErrorEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/mediaerrorevent',
    ['antie/events/mediaevent'],
    function(MediaEvent) {
        'use strict';

        /**
         * Class of events raised when media errors occur
         * @name antie.events.MediaErrorEvent
         * @class
         * @extends antie.events.MediaEvent
         * @param {antie.widgets.Media} target The media widget that fired the event.
         * @param {String} code Error code.
         */

        var MediaErrorEvent = MediaEvent.extend(/** @lends antie.events.MediaErrorEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (target, code) {
                this.code = code;
                init.base.call(this, 'error', target);
            }
        });

        return MediaErrorEvent;
    }
);
