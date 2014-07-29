/**
 * @fileOverview Requirejs module containing the antie.events.SliderChangeEvent class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

require.def('antie/events/sliderchangeevent',
	['antie/events/event'],
	function(Event) {
		/**
		 * Class of events raised when the value of {@link antie.widgets.Slider} has been changed.
		 * @name antie.events.SliderChangeEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {String} type The event type.
		 * @param {antie.widgets.Slider} target The slider that has changed.
		 * @param {Integer} index The new value of the slider.
		 */
		return Event.extend(/** @lends antie.events.SliderChangeEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(type, target, value) {
				this._super(type);
				this.target = target;
				this.value = value;
			}
		});
	}
);
