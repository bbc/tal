/**
 * @fileOverview Requirejs module containing the antie.Device class.
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

/**
 * Contains device-specific code.
 * @name antie.devices
 * @namespace
 */
/**
 * Contains device-specific animation code.
 * @name antie.devices.anim
 * @namespace
 */
/**
 * Contains device-specific broadcast playback code.
 * @name antie.devices.broadcastsource
 * @namespace
 */
/**
 * Contains device-specific media playback code.
 * @name antie.devices.media
 * @namespace
 */
/**
 * Contains device-specific network code.
 * @name antie.devices.net
 * @namespace
 */

require.def('antie/devices/device',
    [
        'antie/class',
        'antie/events/keyevent',
        'antie/storageprovider',
        'antie/devices/storage/session',
        'require'
    ],
    function(Class, KeyEvent, StorageProvider, SessionStorage, require) {
        'use strict';

        /**
         * Abstract base class for Antie devices.
         * Device classes contain an abstraction layer between the {@link Application} and the environment in which
         * the application runs (usually a web-browser).
         *
         * Any of the methods below can be overriden by a device-specific subclass or implementation common to multiple
         * devices can be loaded via requirejs modifiers for this module (referenced in the device config).
         * Device-specific implementations take precendence over those in requirejs modifiers.
         *
         * @name antie.devices.Device
         * @class
         * @abstract
         * @extends antie.Class
         * @requires antie.events.KeyEvent
         * @param {Object} config Device configuration document.
         */
        var Device = Class.extend(/** @lends antie.devices.Device.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function(config) {
                var kc;

                this._application = null;
                this._config = config;
                this._keyMap = {};

                // Manipulate the input map into a mapping between key event keycodes and
                // our virtual key codes
                if (config.input && config.input.map) {
                    var symbolMap = {
                        "UP": KeyEvent.VK_UP,
                        "DOWN": KeyEvent.VK_DOWN,
                        "LEFT": KeyEvent.VK_LEFT,
                        "RIGHT": KeyEvent.VK_RIGHT,
                        "ENTER": KeyEvent.VK_ENTER,
                        "BACK": KeyEvent.VK_BACK,
                        "SPACE": KeyEvent.VK_SPACE,
                        "BACK_SPACE": KeyEvent.VK_BACK_SPACE,
                        "PLAY": KeyEvent.VK_PLAY,
                        "PAUSE": KeyEvent.VK_PAUSE,
                        "PLAY_PAUSE": KeyEvent.VK_PLAY_PAUSE,
                        "STOP": KeyEvent.VK_STOP,
                        "PREV": KeyEvent.VK_PREV,
                        "NEXT": KeyEvent.VK_NEXT,
                        "FAST_FWD": KeyEvent.VK_FAST_FWD,
                        "REWIND": KeyEvent.VK_REWIND,
                        "SUBTITLE": KeyEvent.VK_SUBTITLE,
                        "INFO": KeyEvent.VK_INFO,
                        "VOLUME_UP": KeyEvent.VK_VOLUME_UP,
                        "VOLUME_DOWN": KeyEvent.VK_VOLUME_DOWN,
                        "MUTE": KeyEvent.VK_MUTE,
                        "RED" : KeyEvent.VK_RED,
                        "GREEN" : KeyEvent.VK_GREEN,
                        "YELLOW" : KeyEvent.VK_YELLOW,
                        "BLUE" : KeyEvent.VK_BLUE,
                        "HELP": KeyEvent.VK_HELP,
                        "SEARCH": KeyEvent.VK_SEARCH,
                        "AD": KeyEvent.VK_AUDIODESCRIPTION,
                        "HD": KeyEvent.VK_HD,
                        "A": KeyEvent.VK_A,
                        "B": KeyEvent.VK_B,
                        "C": KeyEvent.VK_C,
                        "D": KeyEvent.VK_D,
                        "E": KeyEvent.VK_E,
                        "F": KeyEvent.VK_F,
                        "G": KeyEvent.VK_G,
                        "H": KeyEvent.VK_H,
                        "I": KeyEvent.VK_I,
                        "J": KeyEvent.VK_J,
                        "K": KeyEvent.VK_K,
                        "L": KeyEvent.VK_L,
                        "M": KeyEvent.VK_M,
                        "N": KeyEvent.VK_N,
                        "O": KeyEvent.VK_O,
                        "P": KeyEvent.VK_P,
                        "Q": KeyEvent.VK_Q,
                        "R": KeyEvent.VK_R,
                        "S": KeyEvent.VK_S,
                        "T": KeyEvent.VK_T,
                        "U": KeyEvent.VK_U,
                        "V": KeyEvent.VK_V,
                        "W": KeyEvent.VK_W,
                        "X": KeyEvent.VK_X,
                        "Y": KeyEvent.VK_Y,
                        "Z": KeyEvent.VK_Z,
                        "0": KeyEvent.VK_0,
                        "1": KeyEvent.VK_1,
                        "2": KeyEvent.VK_2,
                        "3": KeyEvent.VK_3,
                        "4": KeyEvent.VK_4,
                        "5": KeyEvent.VK_5,
                        "6": KeyEvent.VK_6,
                        "7": KeyEvent.VK_7,
                        "8": KeyEvent.VK_8,
                        "9": KeyEvent.VK_9
                    };
                    for (var code in config.input.map) {
                        switch (code) {
                            case "alpha":
                                var A = config.input.map[code][0];
                                var Z = config.input.map[code][1];
                                var AcharCode = "A".charCodeAt(0);
                                for (kc = A; kc <= Z; kc++) {
                                    this._keyMap[kc.toString()] = symbolMap[String.fromCharCode((kc - A) + AcharCode)];
                                }
                                break;
                            case "numeric":
                                var zero = config.input.map[code][0];
                                var nine = config.input.map[code][1];
                                var zeroCharCode = "0".charCodeAt(0);
                                for (kc = zero; kc <= nine; kc++) {
                                    this._keyMap[kc.toString()] = symbolMap[String.fromCharCode((kc - zero) + zeroCharCode)];
                                }
                                break;
                            default:
                                var symbol = config.input.map[code];
                                if (symbol) {
                                    this._keyMap[code.toString()] = symbolMap[symbol];
                                }
                                break;
                        }
                    }
                }

                function ignore() {}

                var ignoreLoggingMethods = {
                    log: ignore,
                    debug: ignore,
                    info: ignore,
                    warn: ignore,
                    error: ignore
                };

                this.filteredLoggingMethods = filterLoggingMethods(config, selectLoggingStrategy(config, this.loggingStrategies));

                function filterLoggingMethods(config, loggingMethods) {
                    /* jshint -W086 */ // We're falling through case statements deliberately
                    var filteredLogging = ignoreLoggingMethods;

                    if (config.logging && config.logging.level) {
                        var level = config.logging.level;
                        switch (level) {
                            case 'all':
                            case 'debug':
                                filteredLogging.debug = loggingMethods.debug;
                            case 'info':
                                filteredLogging.info = loggingMethods.info;
                                filteredLogging.log = loggingMethods.log;
                            case 'warn':
                                filteredLogging.warn = loggingMethods.warn;
                            case 'error':
                                filteredLogging.error = loggingMethods.error;
                        }
                    }
                    return filteredLogging;
                }

                //support functions for the above
                function selectLoggingStrategy(config, loggingStrategies) {

                    if (config.logging && config.logging.strategy) {
                        var configuredLoggingStrategy = 'antie/' + 'devices/' + 'logging/' + config.logging.strategy;

                        if (loggingStrategies[configuredLoggingStrategy]) {
                            return loggingStrategies[configuredLoggingStrategy];
                        }
                    }

                    //no logging methods set - use default logging
                    var selectedLoggingStrategy = loggingStrategies[ 'antie/devices/logging/default' ];

                    if (!selectedLoggingStrategy) {
                        selectedLoggingStrategy = loggingStrategies[ 'antie/devices/logging/onscreen' ];
                    }

                    //still no available logging method - default to ignore
                    if (!selectedLoggingStrategy) {
                        selectedLoggingStrategy = ignoreLoggingMethods;
                    }
                    return selectedLoggingStrategy;
                }
            },
            /**
             * Set a reference to the application the device is running.
             * @param {antie.Application} application The application the device is running.
             */
            setApplication: function(application) {
                this._application = application;
            },
            /**
             * Gets the current device configuration.
             * @returns The current device configuration document.
             */
            getConfig: function() {
                return this._config;
            },
            /**
             * Gets the available screen size.
             * @returns An object with width and height properties.
             */
            getScreenSize: function() {
                throw new Error('Device::getScreenSize not implemented by current Device subclass.');
            },
            /**
             * Get the logging object for the current device.
             * @returns The current device logging object.
             */
            getLogger: function() {
                return this.filteredLoggingMethods;
            },
            /**
             * -PROTECTED- Creates a generic container element in the device's user-agent.
             * Do not use outside of antie. Create {@link antie.widgets.Container} objects to use containers within applications.
             * @protected
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @returns A container element within the device's user-agent.
             */
            createContainer: function(id, classNames) {
            },
            /**
             * -PROTECTED- Creates a label (an element that only contains text) in the device's user-agent.
             * Do not use outside of antie. Create {@link antie.widgets.Label} objects if you need to use labels within an application.
             * @protected
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @param {String} [text] The text within the label.
             * @returns A label within the device's user-agent.
             */
            createLabel: function(id, classNames, text) {
            },
            /**
             * -PROTECTED- Creates a button (an element that can be selected by the user to perform an action) in the device's user-agent.
             * Do not use outside of antie. Create {@link antie.widgets.Button} objects if you need to use buttons within an application.
             * @protected
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @returns A button within the device's user-agent.
             */
            createButton: function(id, classNames) {
            },
            /**
             * -PROTECTED- Creates a list in the device's user-agent.
             * Do not use outside of antie. Create {@link antie.widgets.List} objects if you need to use lists within an application.
             * @protected
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @returns A list within the device's user-agent.
             */
            createList: function(id, classNames) {
            },
            /**
             * -PROTECTED- Creates a list item in the device's user-agent.
             * Do not use outside of antie. Create {@link antie.widgets.ListItem} objects or add widgets to a List if you want use list items within an application
             * @protected
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @returns A list item within the device's user-agent.
             */
            createListItem: function(id, classNames) {
            },
            /**
             * -PROTECTED- Creates an image in the device's user-agent.
             * Do not use outside of antie. Create {@link antie.widgets.Image} objects if you want to use images within an application
             * @protected
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @param {String} src The source URL of the image.
             * @returns An image within the device's user-agent.
             */
            createImage: function(id, classNames, src) {
            },
            /**
             * Appends an element as a child of another.
             * @param {Element} to Append as a child of this element.
             * @param {Element} el The new child element.
             */
            appendChildElement: function(to, el) {
            },
            /**
             * Sets the classes of an element.
             * @param {Element} el The element which will receive new class names.
             * @param {Array} classNames An array of class names.
             */
            setElementClasses: function(el, classNames) {
            },
            /**
             * Removes a class from an element (and optionally descendants)
             * @param {Element} el The element from which to remove the class.
             * @param {String} className The class to remove.
             * @param {Boolean} [deep] If true, and this element has the given class, remove the class from it's children recursively.
             */
            removeClassFromElement: function(el, className, deep) {
            },
            /**
             * Adds a class name to an element
             * @param {Element} el The element which will receive new class name.
             * @param {String} className The new class name to add.
             */
            addClassToElement: function(el, className) {
            },
            /**
             * Adds global key event listener(s) to the user-agent.
             * This must be added in a way that all key events within the user-agent
             * cause self._application.bubbleEvent(...) to be called with a {@link KeyEvent}
             * object with the mapped keyCode.
             *
             * @example
             * document.onkeydown = function(e) {
             *     self._application.bubbleEvent(new KeyEvent("keydown", keyMap[e.keyCode]));
             * };
             */
            addKeyEventListener: function() {
            },
            /**
             * Returns all direct children of an element which have the provided tagName.
             * @param {Element} el The element who's children you wish to search.
             * @param {String} tagName The tag name you are looking for.
             * @returns An array of elements having the provided tag name.
             */
            getChildElementsByTagName: function(el, tagName) {
            },
            /**
             * Returns the top-level element. This is the target of layout class names.
             * @return The top-level DOM element.
             */
            getTopLevelElement: function() {
            },
            /**
             * Returns all the loaded stylesheet elements.
             * @return An array containing all loaded stylesheet elements (link and style elements)
             */
            getStylesheetElements: function() {
            },
            /**
             * Returns the offset of the element within its offset container.
             * @param {Element} el The element you wish to know the offset of.
             * @return An literal object containing properties, top and left.
             */
            getElementOffset: function(el) {
            },
            /**
             * Gets the size of an element.
             * @param {Element} el The element of which to return the size.
             * @returns A size object containing the width and height of the element.
             */
            getElementSize: function(el) {
            },
            /**
             * Sets the size of an element.
             * @param {Element} el The element of which to set the size.
             * @param {Size} size The new size of the element.
             */
            setElementSize: function(el, size) {
            },
            /**
             * -PROTECTED- Scroll an element (within some masking container) so that its top-left corner is at the given position.
             * Note, fps duration and easing parameters currently only implemented when using styletopleft modifier.
             * Do not use from within applications, instead use scrolling methods on the widget you wish to scroll. This method may be deprecated in future.
             * @param {Object} options
             * @param {Element} options.el The element you wish to scroll.
             * @param {Integer} [options.to.left] The x-coordinate you wish to position the top-left corner on. If null, the x-coordinate will not be altered.
             * @param {Integer} [options.to.top] The y-coordinate you wish to position the top-left corner on. If null, the y-coordinate will not be altered.
             * @param {Boolean} [options.skipAnim] By default the movement will be animated, pass <code>true</code> here to prevent animation.
             * @param {Function} [options.onComplete] Callback function to be called when the scroll has been completed.
             * @param {Number} [options.fps=25] Frames per second for scroll animation
             * @param {Number} [options.duration=840] Duration of scroll animation in milliseconds (ms).
             * @param {String} [options.easing.linear] Easing move for scroll animation.
             * @returns {Object} A handle to any animation started
             * @see antie.devices.Device#stopAnimation
             */
            scrollElementTo: function(options) {
            },
            /**
             * -PROTECTED- Moves an element so that its top-left corner is at the given position.
             * Note, fps duration and easing parameters currently only implemented when using styletopleft modifier.
             * Do not use from within applications, instead use the animation methods on the widget you want to move
             * @param {Object} options
             * @param {Element} options.el The element you wish to move.
             * @param {Integer} [options.to.left] The x-coordinate you wish to position the top-left corner on. If null, the x-coordinate will not be altered.
             * @param {Integer} [options.to.top] The y-coordinate you wish to position the top-left corner on. If null, the y-coordinate will not be altered.
             * @param {Boolean} [options.skipAnim] By default the movement will be animated, pass <code>true</code> here to prevent animation.
             * @param {Function} [options.onComplete] Callback function to be called when the move has been completed.
             * @param {Number} [options.fps=25] Frames per second for move animation
             * @param {Number} [options.duration=840] Duration of move animation in milliseconds (ms).
             * @param {String} [options.easing.linear] Easing move for scroll animation.
             * @returns {Object} A handle to any animation started
             * @see #stopAnimation
             */
            moveElementTo: function(options) {
            },
            /**
             * -PROTECTED- Hides an element.
             * Note, fps duration and easing parameters currently only implemented when using styletopleft modifier.
             * Do not use from within applications, instead use the animation methods on the widget you want to hide.
             * @param {Object}  options Details of the element to be hidden, with optional parameters.
             * @param {Element} options.el The element you wish to hide.
             * @param {Boolean} [options.skipAnim] By default the hiding of the element will be animated (faded out). Pass <code>true</code> here to prevent animation.
             * @param {Function} [options.onComplete] Callback function to be called when the element has been hidden.
             * @param {Number}  [options.fps=25] Frames per second for fade animation.
             * @param {Number}  [options.duration=840] Duration of fade animation, in milliseconds (ms).
             * @param {String}  [options.easing=linear] Easing style for fade animation.
             * @returns {Object} A handle to any animation started.
             * @see #stopAnimation
             */
            hideElement: function(options) {
            },
            /**
             * -PROTECTED- Shows an element.
             * Note, fps duration and easing parameters currently only implemented when using styletopleft modifier.
             * Do not use from within applications, instead use the animation methods on the widget you want to hide.
             * @param {Object}  options Details of the element to be shown, with optional parameters.
             * @param {Element} options.el The element you wish to show.
             * @param {Boolean} [options.skipAnim] By default the showing of the element will be animated (faded in). Pass <code>true</code> here to prevent animation.
             * @param {Function} [options.onComplete] Callback function to be called when the element has been shown.
             * @param {Number}  [options.fps=25] Frames per second for fade animation.
             * @param {Number}  [options.duration=840] Duration of fade animation, in milliseconds (ms).
             * @param {String}  [options.easing=linear] Easing style for fade animation.
             * @returns {Object} A handle to any animation started.
             * @see #stopAnimation
             */
            showElement: function(options) {
            },
            /**
             * -PROTECTED- Tweens a property (or properties) of an element's style from one value to another.
             * Note fps only used by styletopleft modifier.
             * @param {Object} options Details of the element whose style will be tweened, with parameters describing tween.
             * @param {Element} options.el The element with a style you wish to tween.
             * @param {Object} options.to A property: value map of the style properties you wish to tween and the numerical value of its destination, e.g { width: 30 }
             * @param {Number} options.duration: The duration of the tween in ms
             * @param {Object} options.from A property: value map of the style properties you wish to set at the start of the animation, e.g. { width: 0 }. If unset, the existing value will be used.
             * @param {Boolean} [options.skipAnim] By default the tween will be animated. Set this to true for the tween to occur immediately. Any onComplete callback will still fire.
             * @param {Function} [options.onComplete] Callback function to be called when the tween is complete.
             * @param {String} [options.easing] Easing style for animation.
             * @param {Object} [options.units] Units to be appended to the style values in a property -> value map. (e.g. { width: 'px' }). Defaults are set in antie.devices.anim.shared.transitionendpoints
             * @param {Number} [options.fps] Frames per second of animation (styletopleft only)
             * @returns {Object} A handle to animation started. This should only be used for passing to stopAnimation and nothing else should be inferred by its value. If no animation occurs, null may be returned but should not be used as an indicator.
             */
            tweenElementStyle: function(options){

            },
            /**
             * Stops the specified animation. The any completeHandler for the animation will be executed.
             * @param {object} anim A handle to the animation you wish to stop.
             */
            stopAnimation: function(anim) {
            },
            /**
             * Encodes an object as JSON.
             * @param {object} obj Object to encode.
             */
            encodeJson: function(obj) {
            },
            /**
             * Decodes JSON.
             * @param {String} json JSON to decode.
             */
            decodeJson: function(json) {
            },
            /**
             * Gets the current key map from the device configuration.
             * @returns The current key map.
             */
            getKeyMap: function() {
                return this._keyMap;
            },
            /**
             * Creates the interface that Media widgets use to communicate
             *  with the device.
             * @param id ID to be used when creating DOM elements.
             * @param mediaType Type of media. "audio" or "video"
             * @param eventCallback Function that is called to processes media events.
             */
            createMediaInterface: function(id, mediaType, eventCallback) {
            },
            /**
             * Get the media player.
             * This will return the correct implementation for the current device.
             */
            getMediaPlayer: function() {
            },
            /**
             * Gets the player embed mode for the current device
             * @param {String} mediaType "video" or "radio".
             * @returns The embed mode of the current player
             */
            getPlayerEmbedMode: function(mediaType) {
                // mediaType: video or audio
            },
            /**
             * Sets the current route (a reference pointing to a location within the application).
             * @param {Array} route A route pointing to a location within the application.
             */
            setCurrentRoute: function(route) {
            },
            /**
             * Gets the current route (a reference pointing to a location within the application).
             * @returns The current route (location within the application).
             */
            getCurrentRoute: function() {
            },
            /**
             * Get an object giving access to the current URL, query string, hash etc.
             * @returns {Object} Object containing, at a minimum, the properties:
             * hash, host, href, pathname, protocol, search. These correspond to the properties
             * in the window.location DOM API.
             * Use getCurrentAppURL(), getCurrentAppURLParams() and getCurrentRoute() to get
             * this information in a more generic way.
             */
            getWindowLocation: function() {
            },
            /**
             * Browse to the specified location. Use launchAppFromURL() and setCurrentRoute() under Application
             * to manipulate the current location more easily.
             * @param {String} url Full URL to navigate to, including search and hash if applicable.
             */
            setWindowLocationUrl: function(url) {
            },
            /**
             * Gets the reference (e.g. URL) of the resource that launched the application.
             * @returns A reference (e.g. URL) of the resource that launched the application.
             */
            getReferrer: function() {
            },
            /**
             * Loads an external script that calls a specified callback function.
             * Used for loading data via JSON-P.
             * @param {String} url The URL of the script.
             * @param {RegExp} callbackFunctionRegExp Regular expression to replace matches with callback function name.
             * @param {Object} callbacks Object containing onSuccess and onLoad callback functions.
             * @param {Integer} timeout Timeout in milliseconds.
             * @param {String} [callbackSuffix] Suffix to append to end of callback function name.
             * @returns The script element that will load the script.
             */
            loadScript: function(url, callbackFunctionRegExp, callbacks, timeout, callbackSuffix) {
            },
            /**
             * Loads an external style sheet.
             * @param {String} url The URL of the style sheet.
             * @param {function(String)} [callback] Callback function when style has loaded/failed
             * @returns The link element that will load the style sheet.
             */
            loadStyleSheet: function(url, callback) {
            },
            /**
             * Loads a resource from a URL protected by device authentication.
             * @param {String} url The URL to load.
             * @param {Object} opts Object containing onLoad and onError callback functions.
             * @returns The request object used to load the resource.
             */
            loadAuthenticatedURL: function(url, opts) {
            },
            /**
             * Loads a resource from a URL.
             * @param {String} url The URL to load.
             * @param {Object} opts Object containing onLoad and onError callback functions.
             * @returns The request object used to load the resource.
             */
            loadURL: function(url, opts) {
            },
            /**
             * Performs a POST HTTP request to a URL on a different host/domain.
             * @param {String} url The URL to post to.
             * @param {Object} data Associative array of fields/values to post.
             * @param {Object} opts Object containing onLoad and onError callback functions.
             */
            crossDomainPost: function(url, opts) {
            },
            /**
             * Performs a cross domain GET for a decoded JSON object utilising CORS if supported by
             * the device, falling back to a JSON-P call otherwise.
             * @param {String} url The URL to load. A callback GET parameter will be appended if JSON-P is used.
             * @param {Object} callbacks Object containing onSuccess and onError callbacks. onSuccess will be called
             * with the decoded JSON object if the call is successful.
             * @param {Object} [options] Options for the JSON-P fallback behaviour. All optional with sensible defaults.
             * @param {Number} [options.timeout=5000] Timeout for the JSON-P call in ms. Default: 5000.
             * @param {String} [options.id] Used in the callback function name for the JSON-P call. Default: a random string.
             * @param {String} [options.callbackKey=callback] Key to use in query string when passing callback function name
             * for JSON-P call. Default: callback
             */
            executeCrossDomainGet: function(url, callbacks, options) {
            },
            /**
             * Performs a cross domain POST HTTP using CORS or the content delivered as a single form field value depending on device capability
             * @param {String} url The URL to post to.
             * @param {Object} data JavaScript object to be JSON encoded and delivered as payload.
             * @param {Object} opts Object containing onLoad and onError callback functions and a fieldName property to be
             * used for the name of the form filed if the iframe hack is used
             */
            executeCrossDomainPost: function(url, data, opts) {
            },
            /**
             * Forces the device to pre-load an image.
             * @param {String} url The URL of the image to preload.
             */
            preloadImage: function(url) {
            },
            /**
             * Checks to see if HD output is currently enabled.
             * @returns True if HD is currently enabled.
             */
            isHDEnabled: function() {
            },
            /**
             * Exits the application directly - no history.
             */
            exit: function() {
                throw new Error('Not supported on this device.');
            },
            /**
             * Exits to broadcast if this function has been overloaded by a modifier. Otherwise, calls exit().
             */
            exitToBroadcast: function() {
                this.exit();
            },
            /**
             * Get a storage provider of a given type for the specified namespace.
             * @param {Number} storageType The type of storage required (either <code>StorageProvider.STORAGE_TYPE_SESSION</code> or <code>StorageProvider.STORAGE_TYPE_PERSISTENT</code>).
             * @param {String} namespace The storage namespace.
             * @returns StorageProvider object.
             */
            getStorage: function(storageType, namespace) {
                if (storageType == StorageProvider.STORAGE_TYPE_SESSION) {
                    return SessionStorage.getNamespace(namespace);
                } else if (storageType == StorageProvider.STORAGE_TYPE_PERSISTENT) {
                    return this.getPersistentStorage(namespace);
                }
            },
            /**
             * Check to see if volume control is supported on this device.
             * @returns Boolean true if volume control is supported.
             */
            isVolumeControlSupported: function() {
                return false;
            },
            /**
             * Get the current volume.
             * @returns The current volume (0.0 to 1.0)
             */
            getVolume: function() {
            },
            /**
             * Set the current volume.
             * @param {Float} volume The new volume level (0.0 to 1.0).
             */
            setVolume: function(volume) {
            },
            /**
             * Check to see if the volume is currently muted.
             * @returns Boolean true if the device is currently muted. Otherwise false.
             */
            getMuted: function() {
            },
            /**
             * Mute or unmute the device.
             * @param {Boolean} muted The new muted state. Boolean true to mute, false to unmute.
             */
            setMuted: function(muted) {
            },
            /**
             * Check to see whether device has disabled animation.
             * @returns {Boolean} true if animation is disabled, false if animation is not disabled.
             */
            isAnimationDisabled: function() {
            },
            /**
             * Create a new widget giving control over broadcast television. Check whether
             * the broadcast television API is available first with isBroadcastSourceSupported().
             * @see antie.widgets.broadcastsource
             * @returns {Object} Device-specific implementation of antie.widgets.broadcastsource
             */
            createBroadcastSource: function() {
            	throw new Error('Broadcast API not available on this device.');
            },
            /**
             * Check to see whether the device has an API to control broadcast television.
             * @returns {Boolean} true if the API is available, false if not.
             */
            isBroadcastSourceSupported: function() {
            	return false;
            }
        });
        /**
         * Loads a device configuration document from the given URL.
         * @name load
         * @memberOf antie.devices.Device
         * @static
         * @function
         * @param {String} configUrl URL to the device configuration document.
         * @param {Object} callbacks Object containing onSuccess and onError callback functions.
         */
        Device.load = function(config, callbacks) {
            try {
                require([config.modules.base].concat(config.modules.modifiers), function(DeviceClass) {
                    try {
                        callbacks.onSuccess(new DeviceClass(config));
                    } catch(ex) {
                        if (callbacks.onError) {
                            callbacks.onError(ex);
                        }
                    }
                });
            } catch(ex) {
                if (callbacks.onError) {
                    callbacks.onError(ex);
                }
            }
        };

        /**
         * Adds a logging method at device init time
         * @name addLoggingMethod
         * @memberOf antie.devices.Device
         * @static
         * @function
         * @param {String} id of require module that defined the logging methods - eg antie/devices/logging/default
         * @param {Object} an object that contains implementations of each logging interface ( log,debug,info,warn,error )
         */

        Device.addLoggingStrategy = function(moduleID, loggingMethods) {
            Device.prototype.loggingStrategies[ moduleID ] = loggingMethods;
        }

        Device.prototype.loggingStrategies = [];
        Device.prototype.filteredLoggingMethods = null;

        return Device;
    }
);
