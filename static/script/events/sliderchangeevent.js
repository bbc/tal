/**
 * @fileOverview Requirejs module containing the antie.events.SliderChangeEvent class.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */

require.def('antie/events/sliderchangeevent',
	['antie/events/event'],
	function(Event) {
		'use strict';

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
