/**
 * @fileOverview Requirejs module containing the antie.events.SliderChangeEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/sliderchangeevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when the value of {@link antie.widgets.Slider} has been changed.
         * @name antie.events.SliderChangeEvent
         * @class
         * @extends antie.events.Event
         * @param {String} type The event type.
         * @param {antie.widgets.Slider} target The slider that has changed.
         * @param {Integer} index The new value of the slider.
         */
        return Event.extend(/** @lends antie.events.SliderChangeEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (type, target, value) {
                init.base.call(this, type);
                this.target = target;
                this.value = value;
            }
        });
    }
);
