/**
 * @fileOverview Requirejs module containing the antie.events.FocusDelayEvent class.
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

require.def('antie/events/focusdelayevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised when focus is gained by a {@link antie.widgets.Button} and
		 * has not been lost within an application-wide number of milliseconds.
		 * @name antie.events.FocusDelayEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {antie.widgets.Button} target The button which gained focus.
		 */
		return Event.extend(/** @lends antie.events.FocusDelayEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target) {
				this.target = target;
				this._super("focusdelay");
			}
		});
	}
);
