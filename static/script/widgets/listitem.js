/**
 * @fileOverview Requirejs module containing the antie.widgets.ListItem class.
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

require.def('antie/widgets/listitem',
	['antie/widgets/container'],
	function(Container) {
		'use strict';

		/**
		 * The ListItem widget is a container widget that is used by the {@link antie.widgets.List} widget when set to <code>List.RENDER_MODE_LIST</code>.
		 * If you wish to control the classNames and id of list items, you can manually create them in your component/formatter and append them to the list.
		 * Otherwise, they will be automatically generated and will wrap other widgets you add to any {@link antie.widgets.List} widget when set to <code>List.RENDER_MODE_LIST</code>.
		 * @name antie.widgets.ListItem
		 * @class
		 * @private
		 * @extends antie.widgets.Container
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 */
		return Container.extend(/** @lends antie.widgets.ListItem.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id) {
				this._super(id);
				this.addClass('listitem');
			},
			/**
			 * Renders the widget and any child widgets to device-specific output using the {@link antie.devices.Device#createListItem} method.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				if(!this.outputElement) {
					this.outputElement = device.createListItem(this.id, this.getClasses());
				}
				return this._super(device);
			}
		});
	}
);
