/**
 * @fileOverview Requirejs module containing the antie.events.FocusDelayEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/focusdelayevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when focus is gained by a {@link antie.widgets.Button} and
         * has not been lost within an application-wide number of milliseconds.
         * @name antie.events.FocusDelayEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.Button} target The button which gained focus.
         */
        return Event.extend(/** @lends antie.events.FocusDelayEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (target) {
                this.target = target;
                init.base.call(this, 'focusdelay');
            }
        });
    }
);
