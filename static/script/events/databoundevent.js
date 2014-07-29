/**
 * @fileOverview Requirejs module containing the antie.events.DataBoundEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/databoundevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised before and after datainding of a {@link antie.widgets.List}.
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
