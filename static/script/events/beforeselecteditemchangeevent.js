/**
 * @fileOverview Requirejs module containing the antie.events.SelectEvent class.
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

require.def('antie/events/beforeselecteditemchangeevent',
	['antie/events/event'],
	function(Event) {
		'use strict';

		/**
		 * Class of events raised when a {@link antie.widgets.List} has been scrolled to another item.
		 * @name antie.events.BeforeSelectedItemChangeEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {antie.widgets.List} target The list that has changed.
		 * @param {antie.widgets.Widget} item The list item that has been selected.
		 * @param {Integer} index The inex of the list item that has been selected.
		 */
		return Event.extend(/** @lends antie.events.BeforeSelectedItemChangeEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target, item, index) {
				this.target = target;
				this.item = item;
				this.index = index;
				this._super("beforeselecteditemchange");
			}
		});
	}
);
