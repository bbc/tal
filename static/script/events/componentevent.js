/**
 * @fileOverview Requirejs module containing the antie.events.ComponentEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/componentevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when a {@link antie.widgets.Component} is being loaded/shown/hidden.
         * @name antie.events.ComponentEvent
         * @class
         * @extends antie.events.Event
         * @param {String} type The type of event.
         * @param {antie.widgets.ComponentContainer} container The container of the component that fired the event.
         * @param {antie.widgets.Component} component The component that fired the event.
         * @param {Object} args Any arguments that were passed into the component when loaded.
         * @param {Object} state Any state information that was stored on the component history stack for this component.
         * @param {Boolean} fromBack True if the event was raised as a result of the user navigating 'back' in the component history.
         */
        return Event.extend(/** @lends antie.events.ComponentEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (type, container, component, args, state, fromBack) {
                this.container = container;
                this.component = component;
                this.args = args;
                this.state = state;
                this.fromBack = fromBack;
                init.base.call(this, type);
            }
        });
    }
);
