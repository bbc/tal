/**
 * @fileOverview Requirejs module containing the antie.events.Event abstract base class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

/**
 * @fileOverview Requirejs module containing the antie.events.Event abstract base class.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 *
 * Antie events.
 * @name antie.events
 * @namespace
 */

require.def('antie/events/event',
	['antie/class'],
	function(Class) {
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
			init: function(type) {
				this.type = type;
				this._propagationStopped = false;
				this._defaultPrevented = false;
				eventCount++;
			},
			/**
			 * Stop propagation of the event through the widget tree.
			 */
			stopPropagation: function() {
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
			isPropagationStopped: function() {
				return this._propagationStopped;
			},
			/**
			 * Prevent any default handler being called for this event.
			 */
			preventDefault: function() {
				this._defaultPrevented = true;
			},
			/**
			 * Check to see if the default handler has been prevented.
			 * @returns Boolean true if the default handler has been prevented.
			 */
			isDefaultPrevented: function() {
				return this._defaultPrevented;
			},
			/**
			 * Add an event listener function to the event stack. Used for 'meta-events'.
			 * @memberOf antie.events.Event
			 * @static
			 * @param {String} ev The event type to listen for (e.g. <code>emptyStack</code>)
			 * @param {Function} func The handler to be called when the event is fired.
			 */
			addEventListener: function(ev, func) {
				var listeners = eventListeners[ev];
				if(!listeners) {
					listeners = eventListeners[ev] = {};
				}
				if(!listeners[func]) {
					listeners[func] = func;
				}
			},
			/**
			 * Removes an event listener function to the event stack. Used for 'meta-events'.
			 * @memberOf antie.events.Event
			 * @static
			 * @param {String} ev The event type that the listener is to be removed from (e.g. <code>emptyStack</code>)
			 * @param {Function} func The handler to be removed.
			 */
			removeEventListener: function(ev, func) {
				var listeners = eventListeners[ev];
				if(listeners && listeners[func]) {
					delete(listeners[func]);
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
			fireEvent: function(ev) {
				var listeners = eventListeners[ev];
				if(listeners) {
					for(var func in listeners) {
						listeners[func]();
					}
				}
			}
		});

		return Event;
	}
);
