/**
 * @fileOverview Requirejs module containing the antie.devices.PS3 class for use with
 * NetFront-based system browser.
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

require.def('antie/devices/ps3',
	[
		'antie/devices/ps3base',
		"antie/events/keyevent"
	],
	function(PS3Base, KeyEvent) {

		return PS3Base.extend({
			/**
			 * Sets the inner content of an element.
			 * @param {Element} el The element of which to change the content.
			 * @param {String} content The new content for the element.
			 */
			setElementContent: function(el, content) {
				// Insert a space before any end tag that is followed 
				// by a space (or else the PS3 will swallow them).
				if (typeof content === "number") {
					// If the content is a number then it won't have any
					// HTML tags so it can be passed without munging
					el.innerHTML = content;
					return;
				}
				if(content) {
					content = content.replace(endtag, " $&");
				}
				el.innerHTML = content;
			},
			/**
			 * Sets the size of an element.
			 * @param {Element} el The element of which to return the size.
			 * @param {Size} size The new size of the element.
			 */
			setElementSize: function(el, size) {
				// The PS3 does not keep inline style sizes in cloned elements
				// so set the width/height attributes too
				if(size.width !== undefined) {
					el.style.width = size.width + "px";
					el.width = size.width;
				}
				if(size.height !== undefined) {
					el.style.height = size.height + "px";
					el.height = size.height;
				}
			},
			/**
			 * Inserts an element as a child of another before a reference element.
			 * @param {Element} to Append as a child of this element.
			 * @param {Element} el The new child element.
			 * @param {Element} ref The reference element which will appear after the inserted element.
			 */
			insertChildElementBefore: function(to, el, ref) {
				// PS3 needs the element removed from the DOM before insertBefore is called
				if(el.parentNode != null) {
					el.parentNode.removeChild(el);
				}
				return this._super(to, el, ref);
			},
			insertChildElementAt: function(to, el, index) {
				// PS3 needs the element removed from the DOM before insertBefore is called
				if(el.parentNode != null) {
					el.parentNode.removeChild(el);
				}
				return this._super(to, el, index);
			},
			addKeyEventListener: function() {
				var self = this;
				var _keyMap = this.getKeyMap();
				var _pressed = {};

				// We need to normalise these events on so that for every key pressed there's
				// one keydown event, followed by multiple keypress events whilst the key is
				// held down, followed by a single keyup event.

				document.onkeydown = function(e) {
					e = e || window.event;

					// Reload app on pressing triangle - DEBUG ONLY
					/* if(e.keyCode == 112) {
						window.location.reload();
						return;
					}*/

					var _keyCode = _keyMap[e.keyCode.toString()];
					if(_keyCode) {
						if(!_pressed[e.keyCode.toString()]) {
							self._application.bubbleEvent(new KeyEvent("keydown", _keyCode));
							_pressed[e.keyCode.toString()] = true;
						} else {
							self._application.bubbleEvent(new KeyEvent("keypress", _keyCode));
						}
						e.preventDefault();
					}
				};
				document.onkeyup = function(e) {
					e = e || window.event;
					var _keyCode = _keyMap[e.keyCode.toString()];
					if(_keyCode) {
						delete _pressed[e.keyCode.toString()];
						self._application.bubbleEvent(new KeyEvent("keyup", _keyCode));
						e.preventDefault();
					}
				};
				document.onkeypress = function(e) {
					e = e || window.event;
					var _keyCode = _keyMap[e.keyCode.toString()];
					if(_keyCode) {
						self._application.bubbleEvent(new KeyEvent("keypress", _keyCode));
						e.preventDefault();
					}
				};
			}
		});
	}
);
