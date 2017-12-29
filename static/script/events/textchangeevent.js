/**
 * @fileOverview Requirejs module containing the antie.events.TextChangeEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/textchangeevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when text is changed by an onscreen keyboard
         * @name antie.events.TextChangeEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.Keyboard} target The keyboard widget that changed text.
         * @param {String} text The new text entered by the keyboard.
         * @param {antie.widgets.Button} button The button selected on the keyboard which caused the text to change.
         * @param {Boolean} multitap <code>true</code> if the text was changed due to a multi-tap press.
         *  Note: You will receive a 2nd event when the multitap timeout finishes with multitap set to <code>false</code>
         */
        return Event.extend(/** @lends antie.events.TextChangeEvent.prototype */{
            /**
             * @constructor
             * @ignore
             */
            init: function init (target, text, button, multitap) {
                this.target = target;
                this.text = text;
                this.button = button;
                this.multitap = multitap;

                init.base.call(this, 'textchange');
            }
        });
    }
);
