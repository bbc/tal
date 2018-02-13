/**
 * @fileOverview Requirejs module containing the antie.events.SelectedItemChangeEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/selecteditemchangeevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when a {@link antie.widgets.List} has been scrolled to another item.
         * @name antie.events.SelectedItemChangeEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.List} target The list that has changed.
         * @param {antie.widgets.Widget} item The list item that has been selected.
         * @param {Integer} index The index of the list item that has been selected.
         */
        return Event.extend(/** @lends antie.events.SelectedItemChangeEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (target, item, index) {
                this.target = target;
                this.item = item;
                this.index = index;
                init.base.call(this, 'selecteditemchange');
            }
        });
    }
);
