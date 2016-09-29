/**
 * @fileOverview Requirejs module containing the before selected item change event
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/beforeselecteditemchangeevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when a {@link antie.widgets.List} has been scrolled to another item.
         * @name antie.events.BeforeSelectedItemChangeEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.List} target The list that has changed.
         * @param {antie.widgets.Widget} item The list item that has been selected.
         * @param {Integer} index The inex of the list item that has been selected.
         */
        return Event.extend(/** @lends antie.events.BeforeSelectedItemChangeEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function(target, item, index) {
                this.target = target;
                this.item = item;
                this.index = index;
                this._super('beforeselecteditemchange');
            }
        });
    }
);
