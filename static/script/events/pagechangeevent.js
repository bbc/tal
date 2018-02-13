/**
 * @fileOverview Requirejs module containing the antie.events.PageChangeEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/pagechangeevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when the page has changed (for stat reporting)
         * @name antie.events.PageChangeEvent
         * @class
         * @extends antie.events.Event
         * @param {String} countername A name given to each web page that can be used for reporting.
         */
        return Event.extend(/** @lends antie.events.PageChangeEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (countername, labels) {
                this.countername = countername;
                this.labels = labels;
                init.base.call(this, 'pagechange');
                if (window.log) {
                    window.log('Page change:', countername, labels);
                }
            }
        });
    }
);
