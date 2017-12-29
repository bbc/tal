/**
 * @fileOverview Requirejs module containing the antie.events.DataBoundEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/databoundevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised before and after databinding of a {@link antie.widgets.List}.
         * @name antie.events.DataBoundEvent
         * @class
         * @extends antie.events.Event
         * @param {String} type The type of the event.
         * @param {antie.widgets.List} target The list that has received data.
         * @param {antie.Iterator} iterator An iterator to the data that has been bound to the list.
         * @param {Object} error Error details (if applicable to the event type).
         */
        return Event.extend(/** @lends antie.events.DataBoundEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (type, target, iterator, error) {
                this.target = target;
                this.iterator = iterator;
                this.error = error;
                init.base.call(this, type);
            }
        });
    }
);
