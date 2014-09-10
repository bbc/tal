/**
 * @fileOverview Requirejs module containing the antie.widgets.HorizontalSlider class.
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

require.def('antie/widgets/horizontalslider',
	[
	 	'antie/widgets/button',
		'antie/events/focusevent',
		'antie/events/blurevent',
		'antie/events/keyevent',
		'antie/events/selectevent',
		'antie/events/sliderchangeevent'
	],
	function(Button, FocusEvent, BlurEvent, KeyEvent, SelectEvent, SliderChangeEvent) {
		'use strict';

		/**
		 * The horizontal slider widget provides a method for users to pecificy a value between 0 and 1 using VK_LEFT and VK_RIGHT
		 * @name antie.widgets.HorizontalSlider
		 * @class
		 * @extends antie.widgets.Container
		 * @requires antie.events.FocusEvent
		 * @requires antie.events.BlurEvent
		 * @requires antie.events.KeyEvent
		 * @requires antie.events.SelectEvent
		 * @requires antie.events.SliderChangeEvent
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {double} [initialValue] Initial value for the slider.
		 * @param {double} [smallIncrement] Amount to increase/decrease the value by when VK_LEFT or VK_RIGHT is pressed.
		 * @param {double} [largeIncrement] Amount to increase/decrease the value by when VK_LEFT or VK_RIGHT is held down.
		 * @param {double} [largeIncrementAfter] Number of smallIncrements to perform until switching to largeIncrement when key is held down.
		 */
		return Button.extend(/** @lends antie.widgets.HorizontalSlider.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, initialValue, smallIncrement, largeIncrement, largeIncrementAfter) {
				this._value = initialValue ? initialValue : 0;
				this._smallIncrement = smallIncrement ? smallIncrement : 0.01;
				this._largeIncrement = largeIncrement ? largeIncrement : 0.05;
				this._largeIncrementAfter = largeIncrementAfter ? largeIncrementAfter : 10;
				this._lastLeft = -1;
				this._keyPressTimer = null;

				this._super(id);
				this.addClass('horizontalslider');

				this._currentIncrementCount = 0;
				this._currentChanged = false;

				var self = this;
				this.addEventListener('keydown', function(e) {
					self._onKeyDown(e);
				});
				this.addEventListener('keypress', function(e) {
					self._onKeyPress(e);
				});
				this.addEventListener('keyup', function(e) {
					self._onKeyUp(e);
				});
			},
			/**
			 * Renders the widget and any child widgets to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				this.outputElement = device.createContainer(this.id, this.getClasses());
				this._button = device.createButton(this.id+'_slider');
				this._left = device.createContainer(this.id+'_left');
				device.addClassToElement(this._button, 'horizontalsliderhandle');
				device.addClassToElement(this._left, 'horizontalsliderleft');
				device.appendChildElement(this.outputElement, this._left);
				device.appendChildElement(this.outputElement, this._button);
				this._moveButton();
				return this.outputElement;
			},
			/**
			 * Moves the inner button to show the current value.
			 * @private
			 */
			_moveButton: function() {
				if(this.outputElement) {
					var device = this.getCurrentApplication().getDevice();
					var elsize = device.getElementSize(this.outputElement);
					var left = Math.floor(this._value * elsize.width);
					if(left != this._lastLeft) {
						this._lastLeft = left;

						if(this._value == 0) {
							this.addClass('start');
							this.removeClass('end');
						} else if(this._value == 1) {
							this.removeClass('start');
							this.addClass('end');
						} else {
							this.removeClass('start');
							this.removeClass('end');
						}
						device.moveElementTo({
							el: this._button, 
							to: {
								left: left
							},
							skipAnim: true
						});
						device.setElementSize(this._left, {width: left});
					}
				}
			},
			/**
			 * KeyDown handler. Allows quick presses of the left/right key to change the value.
			 * @private
			 */
			_onKeyDown: function(evt) {
				var self = this;

				if(evt.keyCode != KeyEvent.VK_LEFT && evt.keyCode != KeyEvent.VK_RIGHT) {
					return;
				}

				var changed = false;
				this._currentIncrementCount++;
				var inc = (this._currentIncrementCount > this._largeIncrementAfter) ? this._largeIncrement : this._smallIncrement;

				if(evt.keyCode == KeyEvent.VK_LEFT && this._value > 0) {
					this._value -= inc;
					if(this._value < 0) {
						this._value = 0;
					}
					changed = true;
				} else if(evt.keyCode == KeyEvent.VK_RIGHT && this._value < 1) {
					this._value += inc;
					if(this._value > 1) {
						this._value = 1;
					}
					changed = true;
				}
				if(changed) {
					this._moveButton();
					this._currentChanged = true;
					this.fireEvent(new SliderChangeEvent("sliderchange", this, this._value));
				}
			},

			/**
			 * KeyPress handler. Changes the value by either the small or large increment depending on how long the
			 * key is held down for. Fires the sliderchange event.
			 * @private
			 */
			_onKeyPress: function(evt) {
				if(evt.keyCode != KeyEvent.VK_LEFT && evt.keyCode != KeyEvent.VK_RIGHT) {
					return;
				}

				// If we're tracking individual key presses, stop it now the key is being held down
				if(this._keyPressTimer) {
					window.clearTimeout(this._keyPressTimer);
					this._keyPressTimer = null;
				}

				var changed = false;
				this._currentIncrementCount++;
				var inc = (this._currentIncrementCount > this._largeIncrementAfter) ? this._largeIncrement : this._smallIncrement;

				if(evt.keyCode == KeyEvent.VK_LEFT && this._value > 0) {
					this._value -= inc;
					if(this._value < 0) {
						this._value = 0;
					}
					changed = true;
				} else if(evt.keyCode == KeyEvent.VK_RIGHT && this._value < 1) {
					this._value += inc;
					if(this._value > 1) {
						this._value = 1;
					}
					changed = true;
				}
				if(changed) {
					this._moveButton();
					this._currentChanged = true;
					this.fireEvent(new SliderChangeEvent("sliderchange", this, this._value));
				}
			},
			/**
			 * KeyUp handler. Resets the increment size and fires the sliderchangeend event.
			 * @private
			 */
			_onKeyUp: function(evt) {
				if(evt.keyCode != KeyEvent.VK_LEFT && evt.keyCode != KeyEvent.VK_RIGHT) {
					return;
				}
				// If the key is pressed again within 0.8s, keep changing the position
				if(this._keyPressTimer) {
					window.clearTimeout(this._keyPressTimer);
				}
				var self = this;
				this._keyPressTimer = window.setTimeout(function() {
						self._keyPressTimer = null;
						if(self._currentChanged) {
							self.fireEvent(new SliderChangeEvent("sliderchangeend", self, self._value));
							self._currentChanged = false;
							self._currentIncrementCount = 0;
							self._currentIncrement = self._smallIncrement;
						}
					}, 800);
			},
			/**
			 * Returns the current value shown by the progress indicator.
			 */
			getValue: function() {
				return this._value;
			},
			/**
			 * Sets the current value to be shown by the progress indicator.
			 * @param {Float} val The value to show (between 0.0 and 1.0 inclusive).
			 */
			setValue: function(val) {
				this._value = val;
				this._moveButton();
			},
			
			/**
			 * Sets the small increment
			 * @param {Float} val The increment value (between 0.0 and 1.0 inclusive).
			 */
			setSmallIncrement: function(val) {
				this._smallIncrement = val;
			}
		});
	}
);
