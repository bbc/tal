/**
 * @fileOverview Requirejs module containing the antie.events.PageChangeEvent class.
 * @author David Dorward <david.dorward@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/pagechangeevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised when the page has changed (for stat reporting)
		 * @name antie.events.PageChangeEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {String} countername A name given to each web page that is used in iStats reports. See https://confluence.dev.bbc.co.uk/display/iStats/Counternames
		 */
		return Event.extend(/** @lends antie.events.PageChangeEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(countername, labels) {
				this.countername = countername;
				this.labels = labels;
				this._super('pagechange');
				if (log) {
					log('Page change:', countername, labels);
				}
			}
		});
	}
);
