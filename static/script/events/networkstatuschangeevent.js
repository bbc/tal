/**
 * @fileOverview Requirejs module containing the antie.events.NetworkStatusChangeEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/networkstatuschangeevent',
	['antie/events/event'],
	function(Event) {
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
