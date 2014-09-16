/**
 * @fileOverview Requirejs module containing the antie.widgets.TextPager class.
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

require.def('antie/widgets/textpager',
	[
	 	'antie/widgets/label',
	 	'antie/events/textpagechangeevent'
	],
	function(Label, TextPageChangeEvent) {
		'use strict';

		/**
		 * The TextPager widget displays text. It computers its own size, allows scrolling and reports page numbers.
		 * @name antie.widgets.TextPager
		 * @class
		 * @extends antie.widgets.Label
		 * @requires antie.events.TextPageChangeEvent
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 */
		var TextPager = Label.extend(/** @lends antie.widgets.TextPager.prototype */{
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id) {
				this._super(id, "");
				this.addClass('textpager');
				this._page = 1;
			},
			/**
			 * Renders the widget and any child widgets to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				var s = this._text;
				
				if(!this.outputElement) {
					this.outputElement = device.createContainer(this.id, this.getClasses());
					this.innerElement = device.createContainer(this.id + "_inner");
					this.outputElement.appendChild(this.innerElement);
				}
				device.setElementContent(this.innerElement, s);
				
				return this.outputElement;
			},
			getPageCount: function () {
				if (!this._paddingFudge) {
					var el = this.outputElement;
					this._paddingFudge = true;
					this.textHeight = this.innerElement.clientHeight;
					this.boxHeight = this.outputElement.clientHeight;
					
					this.lineHeight = this.getCurrentApplication().getLayout().textPager.lineHeight;
					
					this.lines_in_box = Math.floor(this.boxHeight / this.lineHeight);
					this.lines_in_text = Math.floor(this.textHeight / this.lineHeight);
					
					this._pageCount = Math.ceil(this.lines_in_text / this.lines_in_box);
					var extra = this.textHeight - (this.lines_in_text % this.lines_in_box);
					this.innerElement.style.paddingBottom = this.lineHeight * extra + 'px';
				}
				return this._pageCount;
			},
			getCurrentPage: function () {
				return this._page;
			},
			setPage: function (page) {
				var el = this.outputElement;
				this._page = page;
				el.scrollTop = (page - 1) * this.lineHeight * this.lines_in_box;
				this.bubbleEvent(new TextPageChangeEvent(this, page));
			},
			pageUp: function () {
				var page = this.getCurrentPage();
				if (page === 1) {
					return;
				} 
				this.setPage(page - 1);
			},
			pageDown: function () {
				var max = this.getPageCount();
				var page = this.getCurrentPage();
				if (page === max) {
					return;
				} 
				this.setPage(page + 1);
			},

			setText: function(text) {
				this._super(text);

				// Remove the bottom padding to allow the page count to be
				// recalculated.
				if(this.innerElement) {
					this.innerElement.style.paddingBottom = 0;
				}
				this._paddingFudge = false;
			}
		});
		return TextPager;
	}
);
