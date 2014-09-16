/**
 * @fileOverview Requirejs module containing the antie.widgets.ScrubBar class.
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

require.def('antie/widgets/scrubbar',
	['antie/widgets/horizontalslider'],
	function(HorizontalSlider) {
		'use strict';

		/**
		 * The ScrubBar provides a media scrub bar showing current position and portion of the stream that is currently buffered.
		 * @name antie.widgets.ScrubBar
		 * @class
		 * @extends antie.widgets.HorizontalSlider
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {double} [initialValue] Initial value for the slider.
		 * @param {double} [smallIncrement] Amount to increase/decrease the value by when VK_LEFT or VK_RIGHT is pressed.
		 * @param {double} [largeIncrement] Amount to increase/decrease the value by when VK_LEFT or VK_RIGHT is held down.
		 * @param {double} [largeIncrementAfter] Number of smallIncrements to perform until switching to largeIncrement when key is held down.
		 */
		return HorizontalSlider.extend(/** @lends antie.widgets.ScrubBar.prototype */ {
			init: function(id, initialValue, smallIncrement, largeIncrement, largeIncrementAfter) {
				this._super(id, initialValue, smallIncrement, largeIncrement, largeIncrementAfter);

				this._bufferedRange = {start: 0, end: 0};
				this._lastBufferLeft = -1;
				this._lastBufferWidth = -1;
			},

			/**
			 * Renders the widget and any child widgets to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				this.outputElement = this._super(device);
				this._buffer = device.createButton(this.id+'_buffer');
				device.addClassToElement(this._buffer, 'scrubbarbuffer');
				device.prependChildElement(this.outputElement, this._buffer);
				return this.outputElement;
			},
			_moveBuffer: function() {
				if(this.outputElement) {
					var device = this.getCurrentApplication().getDevice();
					var elsize = device.getElementSize(this.outputElement);
					var left = Math.floor(this._bufferedRange.start * elsize.width);
					var width = Math.floor((this._bufferedRange.end - this._bufferedRange.start) * elsize.width);

					if(this._lastBufferLeft != left) {
						this._lastBufferLeft = left;
						device.moveElementTo({
							el: this._buffer,
							to: {
								left: left,
								top: null
							},
							skipAnim: true
						});
					}
					if(this._lastBufferWidth != width) {
						this._lastBufferWidth = width;
						device.setElementSize(this._buffer, {width: width});
					}
				}
			},
			getBufferedRange: function() {
				return this._bufferedRange;
			},
			setBufferedRange: function(bufferedRange) {
				this._bufferedRange = bufferedRange;
				this._moveBuffer();
			}
		});
	}
);
