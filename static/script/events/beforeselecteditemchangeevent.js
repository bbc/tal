/**
 * @fileOverview Requirejs module containing the antie.events.SelectEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/beforeselecteditemchangeevent',
	['antie/events/event'],
	function(Event) {
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
