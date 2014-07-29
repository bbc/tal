/**
 * @fileOverview Requirejs module containing the antie.events.FocusEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/focusevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised when focus is gained by a {@link antie.widgets.Button}.
		 * @name antie.events.FocusEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {antie.widgets.Button} target The button which gained focus.
		 */
		return Event.extend(/** @lends antie.events.FocusEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target) {
				this.target = target;
				this._super("focus");
			}
		});
	}
);
