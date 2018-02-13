/**
 * @fileOverview Requirejs module containing the antie.events.TunerPresentingEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/tunerpresentingevent',
    ['antie/events/event'],
    function (Event) {
        'use strict';

        /**
         * Indicates broadcast has started playing.
         * @class
         * @name antie.events.TunerPresentingEvent
         * @extends antie.events.Event
         * @param {String} channelName The channel name which is now playing.
         */
        return Event.extend(/** @lends antie.events.TunerPresentingEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (channelName) {
                this.channel = channelName;
                init.base.call(this, 'tunerpresenting');
            }
        });
    }
);
