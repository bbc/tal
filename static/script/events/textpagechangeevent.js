/**
 * @fileOverview Requirejs module containing the antie.events.TextPageChangeEvent class.
 * @author David Dorward <david.dorward@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/textpagechangeevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised when page is changed in a TextPager object
		 * @name antie.events.TextPageChangeEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {antie.widgets.TextPager} target The TextPager widget that changed page.
		 * @param {Number} page The new page number.
		 */
		return Event.extend(/** @lends antie.events.TextPageChangeEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target, page) {
				this.target = target;
				this.page = page;

				this._super("textpagechange");
			}
		});
	}
);
