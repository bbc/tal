/**
 * @fileOverview Requirejs module containing the antie.events.TunerStoppedEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/tunerstoppedevent',
    ['antie/events/event'],
    function (Event) {
        'use strict';

        /**
         * Indicates broadcast has stopped playing.
         * @class
         * @name antie.events.TunerStoppedEvent
         * @extends antie.events.Event
         */
        return Event.extend(/** @lends antie.events.Event.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init () {
                init.base.call(this, 'tunerstopped');
            }
        });
    }
);
