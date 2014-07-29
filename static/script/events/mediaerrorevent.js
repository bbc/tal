/**
 * @fileOverview Requirejs module containing the antie.events.MediaEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/mediaerrorevent',
	['antie/events/mediaevent'],
	function(MediaEvent) {
		/**
		 * Class of events raised when media errors occur
		 * @name antie.events.MediaErrorEvent
		 * @class
		 * @extends antie.events.MediaEvent
		 * @param {antie.widgets.Media} target The media widget that fired the event.
		 * @param {String} code Error code.
		 */

		var MediaErrorEvent = MediaEvent.extend(/** @lends antie.events.MediaErrorEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target, code) {
				this.code = code;
				this._super("error", target);
			}
		});

		return MediaErrorEvent;
	}
);
