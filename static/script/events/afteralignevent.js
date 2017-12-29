/**
 * @fileOverview Requirejs module containing the after align event
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/afteralignevent',
    ['antie/events/event'],
    function (Event) {
        'use strict';
        /**
         * Class of events raised when a Mask is about to change alignment of its widget strip.
         * @name antie.events.AfterAlignEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.carousel.Mask} target The mask that is about to align the strip
         * @param {Integer} to the index into the strip of the index alignment is moving to
         * @param {Integer} from the index into the strip of the index alignment is moving from
         */
        return Event.extend(/** @lends antie.events.AfterAlignEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (target, alignedIndex) {
                this.target = target;
                this.alignedIndex = alignedIndex;
                init.base.call(this, 'afteralign');
            }
        });
    }
);
