/**
 * @fileOverview Requirejs module containing the antie.events.SelectEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/selectevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when a {@link antie.widgets.Button} has been selected/activated/clicked by a user.
         * @name antie.events.SelectEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.Button} target The button which has been selected/activated/clicked by the user;
         */
        return Event.extend(/** @lends antie.events.SelectEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (target) {
                this.target = target;
                init.base.call(this, 'select');
            }
        });
    }
);
