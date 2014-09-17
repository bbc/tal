/**
 * @fileOverview Requirejs module containing the antie.events.DataBoundEvent class.
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

require.def('antie/events/databoundevent',
	['antie/events/event'],
	function(Event) {
		'use strict';

		/**
		 * Class of events raised before and after databinding of a {@link antie.widgets.List}.
		 * @name antie.events.DataBoundEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {String} type The type of the event.
		 * @param {antie.widgets.List} target The list that has received data.
		 * @param {antie.Iterator} iterator An iterator to the data that has been bound to the list.
		 * @param {Object} error Error details (if applicable to the event type).
		 */
		return Event.extend(/** @lends antie.events.DataBoundEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(type, target, iterator, error) {
				this.target = target;
				this.iterator = iterator;
				this.error = error;
				this._super(type);
			}
		});
	}
);
