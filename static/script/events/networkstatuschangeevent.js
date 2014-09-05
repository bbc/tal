/**
 * @fileOverview Requirejs module containing the antie.events.NetworkStatusChangeEvent class.
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

require.def('antie/events/networkstatuschangeevent',
	['antie/events/event'],
	function(Event) {
		'use strict';

		/**
		 * Class of events raised when the network state of a device changes (e.g. it goes offline).
		 * @name antie.events.NetworkStatusChangeEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {Integer} networkStatus The new network status.
		 */
		var NetworkStatusChangeEvent = Event.extend(/** @lends antie.events.FocusEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(networkStatus) {
				this.networkStatus = networkStatus;
				this._super("networkstatuschange");
			}
		});

		/**
		 * Device is offline.
		 * @memberOf antie.events.NetworkStatusChangeEvent
		 * @name NETWORK_STATUS_OFFLINE
		 * @constant
		 * @static
		 */
		NetworkStatusChangeEvent.NETWORK_STATUS_OFFLINE = 0;

		/**
		 * Device is online.
		 * @memberOf antie.events.NetworkStatusChangeEvent
		 * @name NETWORK_STATUS_ONLINE
		 * @constant
		 * @static
		 */
		NetworkStatusChangeEvent.NETWORK_STATUS_ONLINE = 1;

		return NetworkStatusChangeEvent;
	}
);
