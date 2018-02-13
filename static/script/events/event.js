/**
 * @fileOverview Requirejs module containing the antie.events.Event abstract base class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */


define(
    'antie/events/event',
    [
        'antie/class',
        'antie/runtimecontext'
    ],
    function(Class, RuntimeContext) {
        'use strict';

        var eventCount = 0;
        var eventListeners = {};

        /**
         * Abstract base class for events.
         * @abstract
         * @extends antie.Class
         * @name antie.events.Event
         * @class
         * @param {String} type The event type (e.g. <code>keydown</code>, <code>databound</code>).
         */
        var Event = Class.extend(/** @lends antie.events.Event.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (type) {
                this.type = type;
                this._propagationStopped = false;
                this._defaultPrevented = false;
                eventCount++;
            },
            /**
             * Stop propagation of the event through the widget tree.
             */
            stopPropagation: function stopPropagation () {
                this._propagationStopped = true;
                eventCount--;
                if (!eventCount) {
                    this.fireEvent('emptyStack');
                }
            },
            /**
             * Check to see if the propagation of this event has been stopped.
             * @returns Boolean true if the event has been stopped, otherwise Boolean false.
             */
            isPropagationStopped: function isPropagationStopped () {
                return this._propagationStopped;
            },
            /**
             * Prevent any default handler being called for this event.
             */
            preventDefault: function preventDefault () {
                this._defaultPrevented = true;
            },
            /**
             * Check to see if the default handler has been prevented.
             * @returns Boolean true if the default handler has been prevented.
             */
            isDefaultPrevented: function isDefaultPrevented () {
                return this._defaultPrevented;
            },
            /**
             * Add an event listener function to the event stack. Used for 'meta-events'.
             * @memberOf antie.events.Event
             * @static
             * @param {String} ev The event type to listen for (e.g. <code>emptyStack</code>)
             * @param {Function} func The handler to be called when the event is fired.
             */
            addEventListener: function addEventListener (ev, func) {
                var listeners = eventListeners[ev];
                if (typeof listeners === 'undefined') {
                    listeners = [];
                    eventListeners[ev] = listeners;
                }
                if (!~listeners.indexOf(func)) {
                    listeners.push(func);
                }
            },
            /**
             * Removes an event listener function to the event stack. Used for 'meta-events'.
             * @memberOf antie.events.Event
             * @static
             * @param {String} ev The event type that the listener is to be removed from (e.g. <code>emptyStack</code>)
             * @param {Function} func The handler to be removed.
             */
            removeEventListener: function removeEventListener (ev, func) {
                var listeners = eventListeners[ev],
                    listener;

                if (!listeners) {
                    RuntimeContext.getDevice().getLogger().error('Attempting to remove non-existent event listener');
                    return false;
                }

                listener = listeners.indexOf(func);
                if (~listener) {
                    listeners.splice(listener, 1);
                }
            },
            /**
             * Fires an event on the event stack.
             * Note: this does not bubble or propagate the event, the concept is meaningless in the context
             * of the event stack.
             * @memberOf antie.events.Event
             * @static
             * @param {String} ev The event to fire (e.g. <code>emptyStack</code>).
             * @see antie.events.Event
             */
            fireEvent: function fireEvent (ev) {
                var listeners = eventListeners[ev];
                if(listeners) {
                    for(var func in listeners) {
                        if(listeners.hasOwnProperty(func)) {
                            listeners[func]();
                        }
                    }
                }
            }
        });

        return Event;
    }
);
