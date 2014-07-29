/**
 * @fileOverview Requirejs module containing the antie.events.MediaEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/mediasourceerrorevent',
	['antie/events/mediaerrorevent'],
	function(MediaErrorEvent) {
		/**
		 * Class of events raised when media error occur on a source
		 * @name antie.events.MediaSourceErrorEvent
		 * @class
		 * @extends antie.events.MediaErrorEvent
		 * @param {antie.widgets.Media} target The media widget that fired the event.
		 * @param {Integer} code Error code.
		 * @param {String} url URL of source which raised error.
		 * @param {Boolean} last True if the source was the last source available.
		 */
		var MediaSourceErrorEvent = MediaErrorEvent.extend(/** @lends antie.events.MediaSourceErrorEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target, code, url, last) {
				this.url = url;
				this.last = last;

				this._super(target, code);
			}
		});

		return MediaSourceErrorEvent;
	}
);
