/**
 * @fileOverview Requirejs module containing the antie.widgets.VerticalList class.
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

require.def('antie/widgets/verticallist',
	[
	 	'antie/widgets/list',
	 	'antie/events/keyevent'
	],
	function(List, KeyEvent) {
		'use strict';

		/**
		 * The VerticalList widget is a container widget that supports spatial navigation between items using {@link KeyEvent.VK_UP} and {@link KeyEvent.VK_DOWN}.
		 * @name antie.widgets.VerticalList
		 * @class
		 * @extends antie.widgets.List
		 * @requires antie.events.KeyEvent
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {antie.Formatter} [itemFormatter] A formatter class used on each data item to generate the list item child widgets.
		 * @param {antie.DataSource|Array} [dataSource] An array of data to be used to generate the list items, or an asynchronous data source.
		 */
		return List.extend(/** @lends antie.widgets.VerticalList.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, itemFormatter, dataSource) {
				this._super(id, itemFormatter, dataSource);
				this.addClass('verticallist');

				var self = this;
				this.addEventListener('keydown', function(e) { self._onKeyDown(e); });
			},
			/**
			 * Key handler for vertical lists. Processes KeyEvent.VK_UP and KeyEvent.VK_DOWN keys and stops propagation
			 * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
			 * spatial navigation out of the list.
			 * @param {antie.events.KeyEvent} evt The key event.
			 */
			_onKeyDown: function(evt) {
				if(evt.keyCode != KeyEvent.VK_UP && evt.keyCode != KeyEvent.VK_DOWN) {
					return;
				}

				var _newSelectedIndex = this._selectedIndex;
				var _newSelectedWidget = null;
				do {
					if(evt.keyCode == KeyEvent.VK_UP) {
						_newSelectedIndex--;
					} else if(evt.keyCode == KeyEvent.VK_DOWN) {
						_newSelectedIndex++;
					}
					if(_newSelectedIndex < 0 || _newSelectedIndex >= this._childWidgetOrder.length) {
						break;
					}
					var _widget = this._childWidgetOrder[_newSelectedIndex];
					if(_widget.isFocusable()) {
						_newSelectedWidget = _widget;
						break;
					}
				} while(true);

				if(_newSelectedWidget) {
					this.setActiveChildWidget(_newSelectedWidget);
					evt.stopPropagation();

				}
			}
		});
	}
);
