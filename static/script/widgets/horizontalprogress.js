/**
 * @fileOverview Requirejs module containing the antie.widgets.HorizontalProgress class.
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

require.def('antie/widgets/horizontalprogress',
	[
	 	'antie/widgets/container',
	 	'antie/widgets/label'
	],
	function(Container, Label) {
		'use strict';

		/**
		 * The horizontal progress widget provides a UI control for showing progress (with associated label)
		 * @name antie.widgets.HorizontalProgress
		 * @class
		 * @extends antie.widgets.Container
		 * @requires antie.widgets.Label
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {Boolean} [showLabel] Pass <code>true</code> to show a label that indicates the value of the progress shown.
		 * @param {Float} [initialValue] The initial value (default 0).
		 */
		return Container.extend(/** @lends antie.widgets.HorizontalProgress.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, showLabel, initialValue) {
				this._value = initialValue ? initialValue : 0;
				this._moveHandle = false;
				this._lastLeft = null;

				this._super(id);
				this.addClass('horizontalprogress');

				if(showLabel) {
					this._label = new Label(id + "_label", "");
					this.addClass('haslabel');
				}
			},
			/**
			 * Renders the widget and any child widgets to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				this.outputElement = device.createContainer(this.id, this.getClasses());
				this._leftElement = device.createContainer(this.id+'_left');
				this._innerElement = device.createContainer(this.id+'_inner');
				device.appendChildElement(this._leftElement, this._innerElement);
				device.appendChildElement(this.outputElement, this._leftElement);

				if(this._label) {
					device.appendChildElement(this.outputElement, this._label.render(device));
				}

				this._moveInner();

				return this.outputElement;
			},
			/**
			 * Moves the inner element to show the current value.
			 * @private
			 */
			_moveInner: function() {	
				var device = this.getCurrentApplication().getDevice();
				var elsize = device.getElementSize(this._leftElement);
				var handleSize = device.getElementSize(this._innerElement)
				var left = Math.floor(this._value * (elsize.width - handleSize.width));

				if(left != this._lastLeft) {
					this._lastLeft = left;

					if(this._moveHandle) {
						device.stopAnimation(this._moveHandle);
					}
	
					var config = device.getConfig();
					var animate = !config.widgets || !config.widgets.horizontalprogress || (config.widgets.horizontalprogress.animate !== false);
					this._moveHandle = device.moveElementTo({
						el: this._innerElement, 
						to: {
							left: left 
						},
						skipAnim: !animate
					});
				}
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
				this._moveInner();
			},
			/**
			 * Sets the text to show in the label.
			 * @param {String} val The text to show.
			 */
			setText: function(val) {
				if(this._label) {
					this._label.setText(val);
				}
			}
		});
	}
);
