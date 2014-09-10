/**
 * @fileOverview Requirejs module containing the antie.widgets.Button class.
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
 */

require.def('antie/widgets/button',
	[
	 	'antie/widgets/container',
	 	'antie/events/focusevent',
	 	'antie/events/focusdelayevent',
	 	'antie/events/blurevent',
	 	'antie/events/keyevent',
	 	'antie/events/selectevent'
	],
	function(Container, FocusEvent, FocusDelayEvent, BlurEvent, KeyEvent, SelectEvent) {
		'use strict';

		/**
		 * The Button widget class represents a container widget which can receive focus and be selected/activated by the user.
		 * @name antie.widgets.Button
		 * @class
		 * @extends antie.widgets.Container
		 * @requires antie.events.FocusEvent
		 * @requires antie.events.FocusDelayEvent
		 * @requires antie.events.BlurEvent
		 * @requires antie.events.KeyEvent
		 * @requires antie.events.SelectEvent
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {boolean} [animationEnabled] If true, a focus delay will be set before displaying the button
		 */
		return Container.extend(/** @lends antie.widgets.Button.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, animationEnabled) {
				//TODO refactor this to set focusDelay explicitly rather than using animationEnabled with fixed focusDelay
				this._super(id);
				this.addClass('button');
				this.addClass('buttonBlurred');

				this._focusDelayHandle = null;
				this._disabled = false;
				
				/* Reduce the focusDelayTimeout for devices that don't have animation enabled */
				if(typeof animationEnabled === "boolean" && !animationEnabled){
					this._focusDelayTimeout = 500;
				}
				else{
					this._focusDelayTimeout = 1500;
				}

				/* if the ENTER key is pressed, translate into into a SelectEvent on this button */
				var self = this;
				this.addEventListener('keydown', function(e) {
					if(e.keyCode == KeyEvent.VK_ENTER) {
						self.select();
						e.stopPropagation();
					}
				});
			},
			/**
			 * Renders the widget and any child widgets to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				this.outputElement = device.createButton(this.id, this.getClasses(), "#");
				for(var i=0; i<this._childWidgetOrder.length; i++) {
					device.appendChildElement(this.outputElement, this._childWidgetOrder[i].render(device));
				}
				return this.outputElement;
			},
			/**
			 * Checks to see if a widget is focussable (as we're a button, returns true).
			 * @see antie.widgets.Button
			 */
			isFocusable: function() {
				// a widget can receive focus if it or any of it's descendants are Buttons
				// We're a button, so we are
				return !this._disabled;
			},
			setDisabled: function(disabled) {
				this._disabled = disabled;
				if(disabled) {
					this.addClass("buttonDisabled");
				} else {
					this.removeClass("buttonDisabled");
				}
			},
			/**
			 * Gives this button focus by setting active children back up the widget tree.
			 * @see antie.widgets.Button
			 * @param {Boolean} [force] Pass <code>true</code> to force focus to a disabled button.
			 * @returns Boolean true if focus has been moved to the button. Otherwise returns false.
			 */
			focus: function(force) {
				var origDisabled = this._disabled;
				if(force) {
					this._disabled = false;
				}

				var focusChanged = true;
				var w = this;
				while(w.parentWidget) {
					if(!w.parentWidget.setActiveChildWidget(w)) {
						focusChanged = false;
					}
					w = w.parentWidget;
				}

				this._disabled = origDisabled;
				
				return focusChanged;
			},
			select: function() {
				this.bubbleEvent(new SelectEvent(this));
			},
			/**
			 * Flags the active child as focussed or blurred.
			 * @param {Boolean} focus True if the active child is to be focussed, False if the active child is to be blurred.
			 * @private
			 */
			_setActiveChildFocussed: function(focus) {
				if(this._focusDelayHandle) {
					clearTimeout(this._focusDelayHandle);
				}
				if(focus) {
					this.removeClass('buttonBlurred');
					this.addClass('buttonFocussed');

					var self = this;
					// Fire a focus delay event if this button has had focus for more than x-seconds.
					this._focusDelayHandle = setTimeout(function() {
						self.bubbleEvent(new FocusDelayEvent(self));
					}, this._focusDelayTimeout);

					this.getCurrentApplication()._setFocussedWidget(this);
				} else {
					this.removeClass('buttonFocussed');
					this.addClass('buttonBlurred');
				}
			},
			removeFocus: function() {
				this._super();
				this.removeClass('buttonFocussed');
				this.addClass('buttonBlurred');
			}
		});
	}
);
