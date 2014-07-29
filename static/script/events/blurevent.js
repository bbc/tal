/**
 * @fileOverview Requirejs module containing the antie.events.BlurEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/blurevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised when focus is removed from a {@link antie.widgets.Button}.
		 * @name antie.events.BlurEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {antie.widgets.Button} target The button which lost focus.
		 */
		return Event.extend(/** @lends antie.events.BlurEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target) {
				this.target = target;
				this._super("blur");
			}
		});
	}
);
