/**
 * @fileOverview Requirejs module containing the antie.events.TextChangeEvent class.
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

require.def('antie/events/textchangeevent',
	['antie/events/event'],
	function(Event) {
		'use strict';

		/**
		 * Class of events raised when text is changed by an onscreen keyboard
		 * @name antie.events.TextChangeEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {antie.widgets.Keyboard} target The keyboard widget that changed text.
		 * @param {String} text The new text entered by the keyboard.
		 * @param {antie.widgets.Button} button The button selected on the keyboard which caused the text to change.
		 * @param {Boolean} multitap <code>true</code> if the text was changed due to a multi-tap press.
		 *	Note: You will receive a 2nd event when the multitap timeout finishes with multitap set to <code>false</code>
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
