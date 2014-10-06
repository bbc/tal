/**
 * @fileOverview Requirejs module containing the antie.widgets.HorizontalList class.
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

require.def('antie/widgets/horizontallist',
	[
	 	'antie/widgets/list',
	 	'antie/events/keyevent'
	],
	function(List, KeyEvent) {
		'use strict';

		/**
		 * The HorizontalList widget is a container widget that supports spatial navigation between items using {@link KeyEvent.VK_LEFT} and {@link KeyEvent.VK_RIGHT}.
		 * @name antie.widgets.HorizontalList
		 * @class
		 * @extends antie.widgets.List
		 * @requires antie.events.KeyEvent
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {antie.Formatter} [itemFormatter] A formatter class used on each data item to generate the list item child widgets.
		 * @param {antie.DataSource|Array} [dataSource] An array of data to be used to generate the list items, or an aysnchronous data source.
		 */
		var HorizontalList = List.extend(/** @lends antie.widgets.HorizontalList.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, itemFormatter, dataSource) {
				// we need to wrap our contents in a mask to support animation
				this._maskElement = null;

				this._super(id, itemFormatter, dataSource);
				this.addClass('horizontallist');

				var self = this;
				this.addEventListener('keydown', function(e) { self._onKeyDown(e); });
			},
			
			/**
			 * Set whether to support wrapping within the list.
			 * @param {Integer} wrapMode 	Pass <code>HorizontalList.WRAP_MODE_NONE</code> for no wrapping.
			 * 								Pass <code>HorizontalList.WRAP_MODE_NONE</code> to allow navigation to wrap.
			 */
			setWrapMode: function(wrapMode) {
				this._wrapMode = wrapMode;
			},
			
			/**
			 * Key handler for horizontal lists. Processes KeyEvent.VK_LEFT and KeyEvent.VK_RIGHT keys and stops propagation
			 * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
			 * spatial navigation out of the list.
			 * @param {antie.events.KeyEvent} evt The key event.
			 */
			_onKeyDown: function(evt) {
				if(evt.keyCode != KeyEvent.VK_LEFT && evt.keyCode != KeyEvent.VK_RIGHT) {
					return;
				}

				var _newSelectedIndex = this._selectedIndex;
				var _newSelectedWidget = null;
				do {
					if(evt.keyCode == KeyEvent.VK_LEFT) {
						_newSelectedIndex--;
					} else if(evt.keyCode == KeyEvent.VK_RIGHT) {
						_newSelectedIndex++;
					}
					
					//force the index to wrap correctly
					if(this._wrapMode == HorizontalList.WRAP_MODE_WRAP ) {
						_newSelectedIndex = ( _newSelectedIndex + this._childWidgetOrder.length ) % this._childWidgetOrder.length;
					}
					else
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

				return (_newSelectedWidget != null);
			}
		});
		
		HorizontalList.WRAP_MODE_NONE = 0;
		HorizontalList.WRAP_MODE_WRAP = 1;
		
		return HorizontalList;
	}
);
