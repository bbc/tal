/**
 * @fileOverview Requirejs module containing the antie.events.TextPageChangeEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/textpagechangeevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when page is changed in a TextPager object
         * @name antie.events.TextPageChangeEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.TextPager} target The TextPager widget that changed page.
         * @param {Number} page The new page number.
         */
        return Event.extend(/** @lends antie.events.TextPageChangeEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (target, page) {
                this.target = target;
                this.page = page;

                init.base.call(this, 'textpagechange');
            }
        });
    }
);
