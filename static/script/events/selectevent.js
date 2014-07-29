/**
 * @fileOverview Requirejs module containing the antie.events.SelectEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/selectevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised when a {@link antie.widgets.Button} has been selected/activated/clicked by a user.
		 * @name antie.events.SelectEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {antie.widgets.Button} target The button which has been selected/activated/clicked by the user;
		 */
		return Event.extend(/** @lends antie.events.SelectEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target) {
				this.target = target;
				this._super("select");
			}
		});
	}
);
