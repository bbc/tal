/**
 * @fileOverview Requirejs module containing the antie.events.TextChangeEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/textchangeevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised when text is changed by an onscreen keyboard
		 * @name antie.events.TextChangeEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {antie.widgets.Keyboard} target The keyboard widget that changed text.
		 * @param {String} text The new text entered by the keyboard.
		 * @param {antie.widgets.Button} button The button selected on the keyboard which caused the text to change.
		 * @param {Boolean} multitap <code>true</code> if the text was changed due to a multi-tap press.
		 *	Note: You will receieve a 2nd event when the multitap timeout finishes with multitap set to <code>false</code>
		 */
		return Event.extend(/** @lends antie.events.TextChangeEvent.prototype */{
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(target, text, button, multitap) {
				this.target = target;
				this.text = text;
				this.button = button;
				this.multitap = multitap;

				this._super("textchange");
			}
		});
	}
);
