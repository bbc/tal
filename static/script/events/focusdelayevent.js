/**
 * @fileOverview Requirejs module containing the antie.events.FocusDelayEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
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
