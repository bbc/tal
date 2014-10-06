/**
 * @fileOverview Requirejs module containing the antie.events.KeyEvent class.
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

require.def('antie/events/keyevent',
	['antie/events/event'],
	function(Event) {
		'use strict';

		/**
		 * Class of events raised when key/remote control buttons are pressed.
		 * Any keycodes contained in these events will have been mapped to
		 * application specific codes (e.g. KeyEvent.VK_ENTER).
		 * @name antie.events.KeyEvent
		 * @class
		 * @extends antie.events.Event
		 * @param {String} type The event type (e.g. <code>keydown</code>, <code>keyup</code>).
		 * @param {Integer} keyCode The normalised keyCode of the key that caused this event to be raised (e.g. <code>KeyEvent.VK_ENTER</code>, <code>KeyEvent.VK_UP</code>).
		 */
		var KeyEvent = Event.extend(/** @lends antie.events.KeyEvent.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(type, keyCode) {
				var index;
				this.keyCode = keyCode;

				// Map hardware alphanumeric key codes back into characters (and space)
				if(keyCode >= KeyEvent.VK_0 && keyCode <= KeyEvent.VK_9) {
					index = keyCode - KeyEvent.VK_0;
					this.keyChar = String.fromCharCode("0".charCodeAt(0) + index);
				} else if(keyCode == KeyEvent.VK_SPACE) {
					this.keyChar = " ";
				} else if(keyCode >= KeyEvent.VK_A && keyCode <= KeyEvent.VK_Z) {
					index = keyCode - KeyEvent.VK_A;
					this.keyChar = String.fromCharCode("A".charCodeAt(0) + index);
				}

				this._super(type);
			}
		});

		/* Device classes should map device-specific keycodes to the following... */

		/**
		 * Virtual key code for the enter/select button.
		 * Based on CEA-2014-A CE-HTML Annex F
		 * @memberOf antie.events.KeyEvent
		 * @name VK_ENTER
		 * @constant
		 * @static
		 */
		KeyEvent.VK_ENTER = 13;

		/**
		 * Virtual key code for the left cursor/arrow button.
		 * Based on CEA-2014-A CE-HTML Annex F
		 * @memberOf antie.events.KeyEvent
		 * @name VK_LEFT
		 * @constant
		 * @static
		 */
		KeyEvent.VK_LEFT = 37;

		/**
		 * Virtual key code for the up cursor/arrow button.
		 * Based on CEA-2014-A CE-HTML Annex F
		 * @memberOf antie.events.KeyEvent
		 * @name VK_UP
		 * @constant
		 * @static
		 */
		KeyEvent.VK_UP = 38;

		/**
		 * Virtual key code for the right cursor/arrow button.
		 * Based on CEA-2014-A CE-HTML Annex F
		 * @memberOf antie.events.KeyEvent
		 * @name VK_RIGHT
		 * @constant
		 * @static
		 */
		KeyEvent.VK_RIGHT = 39;

		/**
		 * Virtual key code for the down cursor/arrow button.
		 * Based on CEA-2014-A CE-HTML Annex F
		 * @memberOf antie.events.KeyEvent
		 * @name VK_DOWN
		 * @constant
		 * @static
		 */
		KeyEvent.VK_DOWN = 40;

		KeyEvent.VK_SPACE = 32;

		KeyEvent.VK_BACK_SPACE = 8;

		KeyEvent.VK_0 = 48;
		KeyEvent.VK_1 = 49;
		KeyEvent.VK_2 = 50;
		KeyEvent.VK_3 = 51;
		KeyEvent.VK_4 = 52;
		KeyEvent.VK_5 = 53;
		KeyEvent.VK_6 = 54;
		KeyEvent.VK_7 = 55;
		KeyEvent.VK_8 = 56;
		KeyEvent.VK_9 = 57;

		KeyEvent.VK_A = 65;
		KeyEvent.VK_B = 66;
		KeyEvent.VK_C = 67;
		KeyEvent.VK_D = 68;
		KeyEvent.VK_E = 69;
		KeyEvent.VK_F = 70;
		KeyEvent.VK_G = 71;
		KeyEvent.VK_H = 72;
		KeyEvent.VK_I = 73;
		KeyEvent.VK_J = 74;
		KeyEvent.VK_K = 75;
		KeyEvent.VK_L = 76;
		KeyEvent.VK_M = 77;
		KeyEvent.VK_N = 78;
		KeyEvent.VK_O = 79;
		KeyEvent.VK_P = 80;
		KeyEvent.VK_Q = 81;
		KeyEvent.VK_R = 82;
		KeyEvent.VK_S = 83;
		KeyEvent.VK_T = 84;
		KeyEvent.VK_U = 85;
		KeyEvent.VK_V = 86;
		KeyEvent.VK_W = 87;
		KeyEvent.VK_X = 88;
		KeyEvent.VK_Y = 89;
		KeyEvent.VK_Z = 90;

        KeyEvent.VK_RED = 403;
        KeyEvent.VK_GREEN = 404;
        KeyEvent.VK_YELLOW = 405;
        KeyEvent.VK_BLUE = 406;

        KeyEvent.VK_HELP  = 156;
        KeyEvent.VK_SEARCH = 112;
        KeyEvent.VK_AUDIODESCRIPTION = 113;
        KeyEvent.VK_HD = 114;

		KeyEvent.VK_PLAY = 415;
		KeyEvent.VK_PAUSE = 19;
		KeyEvent.VK_PLAY_PAUSE = 402;
		KeyEvent.VK_STOP = 413;
		KeyEvent.VK_PREV = 424;
		KeyEvent.VK_NEXT = 425;
		KeyEvent.VK_FAST_FWD = 417;
		KeyEvent.VK_REWIND = 412;
		KeyEvent.VK_INFO = 457;
		KeyEvent.VK_SUBTITLE = 460;
		KeyEvent.VK_BACK = 461;

		KeyEvent.VK_VOLUME_UP = 447;
		KeyEvent.VK_VOLUME_DOWN = 448;
		KeyEvent.VK_MUTE = 449;

		return KeyEvent;
	}
);
