/**
 * @fileOverview Requirejs module containing the antie.events.BlurEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/blurevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when focus is removed from a {@link antie.widgets.Button}.
         * @name antie.events.BlurEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.Button} target The button which lost focus.
         */
        return Event.extend(/** @lends antie.events.BlurEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (target) {
                this.target = target;
                init.base.call(this, 'blur');
            }
        });
    }
);
