/**
 * @fileOverview Requirejs module containing the antie.events.TunerUnavailableEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/tunerunavailableevent',
    ['antie/events/event'],
    function (Event) {
        'use strict';

        /**
         * Indicates broadcast has been interrupted, for example because the broadcast signal has stopped. (e.g. the
         * antenna has been removed from the device.)
         * @class
         * @name antie.events.TunerUnavailableEvent
         * @extends antie.events.Event
         */
        return Event.extend(/** @lends antie.events.Event.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init () {
                init.base.call(this, 'tunerunavailable');
            }
        });
    }
);
