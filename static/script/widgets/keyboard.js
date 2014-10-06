/**
 * @fileOverview Requirejs module containing the on-screen keyboard widget.
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

require.def('antie/widgets/keyboard',
	[
		'antie/widgets/grid',
		'antie/widgets/button',
		'antie/widgets/label',
		'antie/events/keyevent',
		'antie/events/textchangeevent'
	],
	function(Grid, Button, Label, KeyEvent, TextChangeEvent) {
		'use strict';

		/**
		 * On-screen keyboard widget.
		 * @name antie.widgets.Keyboard
		 * @class
		 * @extends antie.widgets.Grid
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {Integer} cols The number of columns of keys on the keyboard.
		 * @param {Integer} rows The number of rows of keys on the keyboard.
		 * @param {String} keys A string of characters which make up the keys, starting top-left and working row-by-row to the bottom-right.
	 	 *			Special characters include:
		 *				"-"	DEL
		 *				" "	SPACE
		 *				"_"	<spacer>
		 */
		var Keyboard = Grid.extend(/** @lends antie.widgets.Keyboard.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, cols, rows, keys) {
				this._super(id, cols, rows);

				this.addClass('keyboard');

				var self = this;
				var device = self.getCurrentApplication().getDevice();

				this._multitapConfig = device.getConfig().input.multitap;
				this._focussedCharacter = null;
				this._currentText = "";
				this._letterButtons = [];
				this._keys = keys;
				this._multiTap = false;
				this._multiTapTimeout = null;
				this._multiTapLastKey = null;
				this._multiTapLastKeyIndex = 0;
				this._capitalisation = Keyboard.CAPITALISATION_UPPER;
				this._maximumLength = null;

				// Select event handler for buttons within the keyboard
				this.addEventListener('select', function(evt) {
					self._onSelectHandler(evt);
				});

				// Event listener to handle keyboard/numeric button press events.
				this.addEventListener('keydown', function(evt) {
					self._onKeyDownHandler(evt);
				});

				this._populateTheGridWithKeyButtons(id, cols, rows);
			},

            // Private function to append a properly-capitalised character to the end of the string.
            _appendCharacter: function (letter) {
                // allow no more characters to be appended if a maximum length has been reached
                if((this._maximumLength !== null) && (this._currentText.length >= this._maximumLength)) {
                    return false;
                }

                if(	(this._capitalisation != Keyboard.CAPITALISATION_LOWER)
                    && (
                    (this._capitalisation == Keyboard.CAPITALISATION_UPPER)
                        || this._currentText.length == 0
                        || this._currentText[this._currentText.length-1] == ' '
                    )
                    ) {
                    letter = letter.toUpperCase();
                } else {
                    letter = letter.toLowerCase();
                }
                this._currentText += letter;

                this._correctTitleCase();

                return true;
            },

            _correctTitleCase: function () {
                if(this._capitalisation == Keyboard.CAPITALISATION_TITLE) {
                    this._currentText = this._currentText.replace(Keyboard.LAST_WORD_REGEXP, function(match) {
                        match = match.substring(0, 1).toUpperCase() + match.substring(1);
                        return match.replace(Keyboard.SHORT_WORD_REGEXP, function(match) { return match.toLowerCase(); });
                    });
                    this._currentText = this._currentText.substring(0, 1).toUpperCase() + this._currentText.substring(1);
                }
            },

            _onSelectHandler: function (evt) {
                var letter = evt.target.getDataItem();
                var changed = false;
                switch(letter) {
                    case "DEL":
                        if(this._currentText.length > 0) {
                            this._currentText = this._currentText.substring(0, this._currentText.length - 1);
                            this._correctTitleCase();
                            changed = true;
                        }
                        break;
                    case "SPACE":
                        changed = this._appendCharacter(" ");
                        break;
                    default:
                        changed = this._appendCharacter(letter);
                        break;
                }

                if(changed) {
                    this._updateClasses();
                    this.bubbleEvent(new TextChangeEvent(this, this._currentText, evt.target, false));
                }
            },

            _onKeyDownHandler: function (evt) {
                if(evt.keyChar) {
                    evt.stopPropagation();
                    // If the device supports multitap, multitap is enabled and a number is pressed...
                    if(this._multitapConfig && this._multiTap && /[0-9]/.test(evt.keyChar)) {
                        if(this._multiTapTimeout) {
                            clearTimeout(this._multiTapTimeout);
                        }

                        var chars = this._multitapConfig[evt.keyChar];
                        if((evt.keyChar == this._multiTapLastKey) && this._multiTapTimeout) {
                            this._currentText = this._currentText.substring(0, this._currentText.length - 1);
                        } else {
                            this._multiTapLastKeyIndex = -1;
                        }

                        // Find the next character for the pressed key that's available on this keyboard
                        do {
                            this._multiTapLastKeyIndex++;
                            if(this._multiTapLastKeyIndex >= chars.length) this._multiTapLastKeyIndex = 0;
                        } while(!this._letterButtons[chars[this._multiTapLastKeyIndex]]);

                        this._focussedCharacter = chars[this._multiTapLastKeyIndex];
                        this._letterButtons[chars[this._multiTapLastKeyIndex]].focus();
                        this._appendCharacter(chars[this._multiTapLastKeyIndex]);

                        this._multiTapLastKey = evt.keyChar;

                        this._updateClasses();

                        // Fire a text change event, but notify listeners that it may change due to being multitap
                        this.bubbleEvent(new TextChangeEvent(this, this._currentText, null, true));

                        this._multiTapTimeout = setTimeout(function() {
                            this._multiTapTimeout = null;
                            // Fire a new text change event to notify listeners that the multi-tap timeout has finished
                            this.bubbleEvent(new TextChangeEvent(this, this._currentText, null, false));
                        }, 1000);
                    } else {
                        // Select and focus the button on the keyboard for the pressed key
                        var button = this._letterButtons[evt.keyChar];
                        if(button) {
                            this._focussedCharacter = evt.keyChar;
                            button.focus();
                            button.select();
                        }
                    }
                } else if(evt.keyCode == KeyEvent.VK_BACK_SPACE) {
                    if(this._currentText.length > 0) {
                        this._currentText = this._currentText.substring(0, this._currentText.length - 1);
                        this._correctTitleCase();

                        this._updateClasses();

                        this.bubbleEvent(new TextChangeEvent(this, this._currentText, null, false));
                    }
                } else if(evt.keyCode == KeyEvent.VK_RIGHT) {
                    if(this._multiTapTimeout) {
                        this._multiTapTimeout = null;
                        // Fire a new text change event to notify listeners that the multi-tap timeout has finished
                        this.bubbleEvent(new TextChangeEvent(this, this._currentText, null, false));
                        evt.stopPropagation();
                    }
                }
            },
			
			_populateTheGridWithKeyButtons: function (id, cols, rows) {
				for(var col = 0; col < cols; col++) {
					for(var row = 0; row < rows; row++) {			
						var keyIndexId = (row*cols)+col;
						var letter = this._keys[keyIndexId];
						
						if(letter == " ") { letter = "SPACE" }
						else if(letter == "-") { letter = "DEL" }
						else if(letter == "_") { continue }

						var button = new Button(this.id + '_' + letter + "_" + col + "_" + row);
						button.setDataItem(letter);
						button.addClass('key'+letter);
						button.addClass('keyboardButton');
						button.appendChildWidget(new Label(letter));

						this._letterButtons[this._keys[keyIndexId]] = button;

						this.setWidgetAt(col, row, button);
					}
				}
			},
			
			/**
			 * Sets whether to support multi-tap on this keyboard. Note: the device must also support it.
			 * @param {Boolean} multiTap Pass <code>true</code> to enable multi-tap.
			 */
			setMultiTap: function(multiTap) {
				this._multiTap = multiTap;
			},
			/**
			 * Gets whether to multi-tap is supported by this keyboard.
			 * @returns Boolean <code>true</code> if multi-tap is supported by this keyboard.
			 */
			getMultiTap: function() {
				return this._multiTap;
			},
			/**
			 * Sets the current text entered/to-be-edited by this keyboard.
			 * @param {String} text String to be edited by this keyboard.
			 */
			setText: function(text) {
				this._currentText = text;
				this._updateClasses();
			},
			/**
			 * Gets the text entered/edited by this keyboard.
			 * @returns The text entered/edited by this keyboard.
			 */
			getText: function() {
				return this._currentText;
			},
			/**
			 * Sets the capitalisation mode of the keyboard. {@see Keyboard.CAPITALISATION_UPPER},
			 * {@see Keyboard.CAPITALISATION_LOWER} and {@see Keyboard.CAPITALISATION_TITLE}
			 * @param {Integer} capitalisation The capitalisation mode to use.
			 */
			setCapitalisation: function(capitalisation) {
				this._capitalisation = capitalisation;
			},
			/**
			 * Gets the current capitalisation mode of the keyboard.
			 * @returns The capitalisation mode of the keyboard.
			 */
			getCapitalisation: function() {
				return this._capitalisation;
			},
			/**
			 * Sets the active child widget as the button for the specified character.
			 * @param {String} character The character who's button should be the active child widget.
			 */
			setActiveChildKey: function(character) {
				this._focussedCharacter = character;
				this.setActiveChildWidget(this._letterButtons[character]);
			},
			focus: function() {
				this._letterButtons[this._focussedCharacter].focus();
			},
			setFocusToActiveChildKey: function(character){
				this.setActiveChildKey(character);
				this.focus();
			},
			/**
			 * Sets the maximum number of characters that can be entered
			 * @param {Integer} length The maxmimum number of characters that can be entered. Pass <code>null</code> to allow infinite characters.
			 */
			setMaximumLength: function(length) {
				this._maximumLength = length;
			},
			/**
			 * Gets the maximum number of characters that can be entered
			 * @returns The maximum number of characters that can be entered
			 */
			getMaximumLength: function() {
				return this._maximumLength;
			},

			_updateClasses: function() {
				if((this._maximumLength !== null) && (this._currentText != null) && (this._currentText.length >= this._maximumLength)) {
					this.addClass('maxlength');
					// Move focus to the DEL key, as it's
					// the only one that can be used now.
					this.setActiveChildKey("-");
				} else {
					this.removeClass('maxlength');
				}
			}
		});

		Keyboard.LAST_WORD_REGEXP = /([^\s]+)$/;
		Keyboard.SHORT_WORD_REGEXP = /^(to|is|in|on|it|and|at|by|a|an|of|if)$/i;

		Keyboard.CAPITALISATION_UPPER = 0;
		Keyboard.CAPITALISATION_LOWER = 1;
		Keyboard.CAPITALISATION_TITLE = 2;

		return Keyboard;
	}
);
