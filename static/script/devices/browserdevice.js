/* jshint -W030 */
/**
 * @fileOverview Requirejs module containing the antie.BrowserDevice class.
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

require.def("antie/devices/browserdevice",
    [
        "antie/devices/device",
        "antie/events/keyevent",
        "antie/historian"
    ],
    function(Device, KeyEvent, Historian) {
        'use strict';

        function trim(str) {
            return str.replace(/^\s+/, '').replace(/\s+$/, '');
        }

        /**
         * Base class for Antie browser-based devices.
         * @name antie.devices.BrowserDevice
         * @class
         * @extends antie.devices.Device
         * @requires antie.events.KeyEvent
         * @param {Object} config Device configuration document.
         */
        return Device.extend(/** @lends antie.devices.BrowserDevice.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function(config) {
                this._super(config);
                this._textSizeCache = {};

                this.addClassToElement(this.getTopLevelElement(), "notanimating");
            },
            /**
             * Returns the index of an object in an array. Behaves as native JavaScript 1.5 Array.indexOf().
             * @param {Array} arr Array in which to search.
             * @param {Object} obj Object to search for.
             * @param {Integer} start Index from which to start searching.
             * @returns Index of object in array. -1 if object is not found.
             */
            arrayIndexOf: function(arr, obj, start) {
                if (typeof(Array.prototype.indexOf) === 'function') {
                    return arr.indexOf(obj, start);
                } else {
                    for (var i = (start || 0); i < arr.length; i++) {
                        if (arr[i] == obj) {
                            return i;
                        }
                    }
                    return -1;
                }
            },
            /**
             * Creates an element in the device's user-agent.
             * @private
             * @param {String} tagName The tag name of the element to create.
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             */
            _createElement: function(tagName, id, classNames) {
                var el = document.createElement(tagName);

                // don't add auto-generated IDs to the DOM
                if (id && (id.substring(0, 1) != "#")) {
                    el.id = id;
                }
                if (classNames && (classNames.length > 0)) {
                    el.className = classNames.join(" ");
                }
                return el;
            },
            /**
             * Creates a generic container element in the device's user-agent.
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @returns A container element within the device's user-agent.
             */
            createContainer: function(id, classNames) {
                return this._createElement("div", id, classNames);
            },
            /**
             * Creates a label (an element that only contains text) in the device's user-agent.
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @param {String} [text] The text within the label.
             * @returns A label within the device's user-agent.
             */
            createLabel: function(id, classNames, text) {
                var el = this._createElement("span", id, classNames);
                this.setElementContent(el, text);
                return el;
            },
            /**
             * Creates a button (an element that can be selected by the user to perform an action) in the device's user-agent.
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @returns A button within the device's user-agent.
             */
            createButton: function(id, classNames) {
                return this._createElement("div", id, classNames);
            },
            /**
             * Creates a list in the device's user-agent.
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @returns A list within the device's user-agent.
             */
            createList: function(id, classNames) {
                return this._createElement("ul", id, classNames);
            },
            /**
             * Creates a list item in the device's user-agent.
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @returns A list item within the device's user-agent.
             */
            createListItem: function(id, classNames) {
                return this._createElement("li", id, classNames);
            },
            /**
             * Creates an image in the device's user-agent.
             * @param {String} [id] The id of the element to create.
             * @param {Array} [classNames] An array of class names to apply to the element.
             * @param {String} src The source URL of the image.
             * @param {Size} [size] The size of the image.
             * @returns An image within the device's user-agent.
             */
            createImage: function(id, classNames, src, size, onLoad, onError) {
                var el = this._createElement("img", id, classNames);
                el.src = src;
                el.alt = "";
                if (size) {
                    this.setElementSize(el, size);
                }
                if (onLoad !== undefined) {
                    el.onload = onLoad;
                }
                if (onError !== undefined) {
                    el.onerror = onError;
                }
                return el;
            },
            /**
             * Loads an external style sheet.
             * @param {String} url The URL of the style sheet.
             * @param {function(String)} [callback] Callback function when style has loaded/failed
             * @returns The link element that will load the style sheet.
             */
            loadStyleSheet: function(url, callback) {
                var self = this;
                function supportsCssRules() {
                    var style = self._createElement("style");
                    style.type = "text/css";
                    style.innerHTML = 'body {};';
                    style.className = "added-by-antie";
                    document.getElementsByTagName("head")[0].appendChild(style);
                    try {
                        style.sheet.cssRules;
                        return true;
                    } catch(ex) {
                    } finally {
                        style.parentNode.removeChild(style);
                    }
                    return false;
                }

                if (callback && supportsCssRules()) {
                    var style = this._createElement("style");
                    style.type = "text/css";
                    style.innerHTML = "@import url('" + url + "');";
                    style.className = "added-by-antie";
                    document.getElementsByTagName("head")[0].appendChild(style);

                    var interval = window.setInterval(function() {
                        try {
                            style.sheet.cssRules;
                            window.clearInterval(interval);
                        } catch(ex) {
                            return;
                        }
                        callback(url);
                    }, 200);
                } else {
                    var link = this._createElement("link");
                    link.type = "text/css";
                    link.rel = "stylesheet";
                    link.href = url;
                    link.className = "added-by-antie";
                    document.getElementsByTagName("head")[0].appendChild(link);

                    // Onload trickery from:
                    // http://www.backalleycoder.com/2011/03/20/link-tag-css-stylesheet-load-event/
                    if (callback) {
                        var img = this._createElement("img");
                        var done = function() {
                            img.onerror = function() {};
                            callback(url);
                            img.parentNode.removeChild(img);
                        };
                        img.onerror = done;
                        this.getTopLevelElement().appendChild(img);
                        img.src = url;
                    }
                }
                return style;
            },
            /**
             * Appends an element as a child of another.
             * @param {Element} to Append as a child of this element.
             * @param {Element} el The new child element.
             */
            appendChildElement: function(to, el) {
                to.appendChild(el);
            },
            /**
             * Prepends an element as a child of another.
             * @param {Element} to Prepend as a child of this element.
             * @param {Element} el The new child element.
             */
            prependChildElement: function(to, el) {
                if (to.childNodes.length > 0) {
                    to.insertBefore(el, to.childNodes[0]);
                } else {
                    to.appendChild(el);
                }
            },
            /**
             * Inserts an element as a child of another before a reference element.
             * @param {Element} to Append as a child of this element.
             * @param {Element} el The new child element.
             * @param {Element} ref The reference element which will appear after the inserted element.
             */
            insertChildElementBefore: function(to, el, ref) {
                to.insertBefore(el, ref);
            },
            /**
             * Inserts an element as a child of another at the given index.
             * @param {Element} to Append as a child of this element.
             * @param {Element} el The new child element.
             * @param {Integer} index The index at which the element will be inserted.
             */
            insertChildElementAt: function(to, el, index) {
                if (index >= to.childNodes.length) {
                    to.appendChild(el);
                } else {
                    to.insertBefore(el, to.childNodes[index]);
                }
            },
            /**
             * Gets the parent element of a given element.
             * @param {Element} el The element.
             * @returns The parent element.
             */
            getElementParent: function(el) {
                return el.parentNode;
            },
            /**
             * Removes an element from its parent.
             * @param {Element} el The element to remove.
             */
            removeElement: function(el) {
                if (el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            },
            /**
             * Clears the content of an element.
             * @param {Element} el The element you are removing the content from.
             */
            clearElement: function(el) {
                for (var i = el.childNodes.length - 1; i >= 0; i--) {
                    el.removeChild(el.childNodes[i]);
                }
            },
            /**
             * Sets the classes of an element.
             * @param {Element} el The element which will receive new class names.
             * @param {Array} classNames An array of class names.
             */
            setElementClasses: function(el, classNames) {
                el.className = classNames.join(" ");
            },
            /**
             * Removes a class from an element (and optionally descendants)
             * @param {Element} el The element from which to remove the class.
             * @param {String} className The class to remove.
             * @param {Boolean} [deep] If true, and this element has the given class, remove the class from it's children recursively.
             */
            removeClassFromElement: function(el, className, deep) {
                if (new RegExp(" " + className + " ").test(" " + el.className + " ")) {
                    el.className = trim((" " + el.className + " ").replace(" " + className + " ", " "));
                }
                if (deep) {
                    for (var i = 0; i < el.childNodes.length; i++) {
                        this.removeClassFromElement(el.childNodes[i], className, true);
                    }
                }
            },
            /**
             * Adds a class name to an element
             * @param {Element} el The element which will receive new class name.
             * @param {String} className The new class name to add.
             */
            addClassToElement: function(el, className) {
                this.removeClassFromElement(el, className, false);
                el.className = trim(el.className + " " + className);
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
                var self = this;
                var _keyMap = this.getKeyMap();
                var _pressed = {};

                // We need to normalise these events on so that for every key pressed there's
                // one keydown event, followed by multiple keypress events whilst the key is
                // held down, followed by a single keyup event.

                document.onkeydown = function(e) {
                    e = e || window.event;
                    var _keyCode = _keyMap[e.keyCode.toString()];
                    if (_keyCode) {
                        if (!_pressed[e.keyCode.toString()]) {
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
                    if (_keyCode) {
                        delete _pressed[e.keyCode.toString()];
                        self._application.bubbleEvent(new KeyEvent("keyup", _keyCode));
                        e.preventDefault();
                    }
                };
                document.onkeypress = function(e) {
                    e = e || window.event;
                    var _keyCode = _keyMap[e.keyCode.toString()];
                    if (_keyCode) {
                        self._application.bubbleEvent(new KeyEvent("keypress", _keyCode));
                        e.preventDefault();
                    }
                };
            },
            /**
             * Gets the size of an element.
             * @param {Element} el The element of which to return the size.
             * @returns A size object containing the width and height of the element.
             */
            getElementSize: function(el) {
                return {
                    width: el.clientWidth || el.offsetWidth,
                    height: el.clientHeight || el.offsetHeight
                };
            },
            /**
             * Sets the size of an element.
             * @param {Element} el The element of which to set the size.
             * @param {Size} size The new size of the element.
             */
            setElementSize: function(el, size) {
                if (size.width !== undefined) {
                    el.style.width = size.width + "px";
                }
                if (size.height !== undefined) {
                    el.style.height = size.height + "px";
                }
            },
            /**
             * Sets the position of an element
             * @param {Element} el The element of which to reposition.
             * @param {Size} size The new position of the element.
             */
            setElementPosition: function(el, pos) {
                if (pos.top !== undefined) {
                    el.style.top = pos.top + "px";
                }
                if (pos.left !== undefined) {
                    el.style.left = pos.left + "px";
                }
            },
            /**
             * Sets the inner content of an element.
             * @param {Element} el The element of which to change the content.
             * @param {String} content The new content for the element.
             */
            setElementContent: function(el, content) {
                if (content === "") {
                    this.clearElement(el);
                    return;
                }
                el.innerHTML = content;
            },
            /**
             * Clones an element.
             * @param {Element} el The element to clone.
             * @param {Boolean} [deep] If true, children are also cloned recursively.
             * @param {String} [appendClass] Append this class name to the clone (top level only).
             * @param {String} [appendID] Append this string to the ID of the clone (top level only).
             * @returns The clone.
             */
            cloneElement: function(el, deep, appendClass, appendID) {
                var clone = el.cloneNode(deep);
                if (appendClass) {
                    clone.className += " " + appendClass;
                }
                if (appendID && el.id) {
                    clone.id = el.id + appendID;
                }
                return clone;
            },
            /**
             * Get the height (in pixels) of a given block of text (of a provided set of class names) when constrained to a fixed width.
             *
             * @deprecated This function does not always give accurate results. When measuring size, it only takes into account
             * the classes on the text element being measured. It doesn't consider any CSS styles that may have been passed down
             * through the DOM.
             *
             * @param {String} text The text to measure.
             * @param {Integer} maxWidth The width the text is constrained to.
             * @param {Array} classNames An array of class names which define the style of the text.
             * @returns The height (in pixels) that is required to display this block of text.
             */
            getTextHeight: function(text, maxWidth, classNames) {
                /// TODO: is there a more efficient way of doing this?
                var cacheKey = maxWidth + ":" + classNames.join(" ") + ":" + text;
                var height;
                if (!(height = this._textSizeCache[cacheKey])) {
                    if (!this._measureTextElement) {
                        this._measureTextElement = this.createLabel("measure", null, "fW");
                        this._measureTextElement.style.display = "block";
                        this._measureTextElement.style.position = "absolute";
                        this._measureTextElement.style.top = "-10000px";
                        this._measureTextElement.style.left = "-10000px";
                        this.appendChildElement(document.body, this._measureTextElement);
                    }
                    this._measureTextElement.className = classNames.join(" ");
                    this._measureTextElement.style.width = (typeof maxWidth === 'number') ? maxWidth + "px" : maxWidth;
                    this._measureTextElement.innerHTML = text;

                    height = this._textSizeCache[cacheKey] = this._measureTextElement.clientHeight;
                }
                return height;
            },
            /**
             * Returns all direct children of an element which have the provided tagName.
             * @param {Element} el The element who's children you wish to search.
             * @param {String} tagName The tag name you are looking for.
             * @returns An array of elements having the provided tag name.
             */
            getChildElementsByTagName: function(el, tagName) {
                var children = [];
                tagName = tagName.toLowerCase();
                for (var i = 0; i < el.childNodes.length; i++) {
                    if(el.childNodes[i].tagName){
                        if (el.childNodes[i].tagName.toLowerCase() == tagName) {
                        children.push(el.childNodes[i]);
                        }
                    }
                }
                return children;
            },
            /**
             * Returns the top-level element. This is the target of layout class names.
             * @return The top-level DOM element.
             */
            getTopLevelElement: function() {
                return document.documentElement || document.body.parentNode || document;
            },
            /**
             * Returns all the loaded stylesheet elements.
             * @return An array containing all stylesheet related DOM elements (link and style elements)
             */
            getStylesheetElements: function() {
                var stylesheetElements = [];

                var linkElements = document.getElementsByTagName('link');
                var styleElements = document.getElementsByTagName('style');

                // Loop over the node lists and push the dom elements into an array
                for (var i = 0; i < linkElements.length; i++) {
                    stylesheetElements.push(linkElements[i]);
                }

                for (var j = 0; j < styleElements.length; j++) {
                    stylesheetElements.push(styleElements[j]);
                }

                return stylesheetElements;
            },
            /**
             * Returns the offset of the element within its offset container.
             * @param {Element} el The element you wish to know the offset of.
             * @return An literal object containing properties, top and left.
             */
            getElementOffset: function(el) {
                var rect, parentRect, offsets;
//                if (el && el.getBoundingClientRect && el.parentNode) {
//                    rect = el.getBoundingClientRect();
//                    parentRect = el.parentNode.getBoundingClientRect();
//                    offsets = {
//                        top: rect.top - parentRect.top,
//                        left: rect.left - parentRect.left
//                    };
//                } else {
                    offsets = {
                        top: el.offsetTop,
                        left: el.offsetLeft
                    };
//                }
                return offsets;
            },
            /**
             * Gets the available browser screen size.
             * @returns An object with width and height properties.
             */
            getScreenSize: function() {
                var w, h;
                if (typeof(window.innerWidth) == 'number') {
                    w = window.innerWidth;
                    h = window.innerHeight;
                } else {
                    var d = document.documentElement || document.body;
                    h = d.clientHeight || d.offsetHeight;
                    w = d.clientWidth || d.offsetWidth;
                }
                return {
                    width: w,
                    height: h
                };
            },
            /**
             * Sets the current route (a reference pointing to a location within the application).
             * @param {Array} route A route pointing to a location within the application.
             */
            setCurrentRoute: function(route) {
                var history = this.getHistorian().toString();
                
                if (route.length > 0) {
                    window.location.hash = "#" + route.join("/") + history;
                } else {
                    window.location.hash = (history === '') ? '' : '#' + history;
                }
            },
            /**
             * Gets the current route (a reference pointing to a location within the application).
             * @returns The current route (location within the application).
             */
            getCurrentRoute: function() {
                var unescaped = unescape(window.location.hash).split(Historian.HISTORY_TOKEN, 1)[0];
                return (unescaped.replace(/^#/, '').split('/'));
            },
            
            /**
             * gets historian for current location
             * @returns {antie.Historian} an object that can be used to get a back or forward url between applications while preserving history
             */
            getHistorian: function() {
                return new Historian(decodeURI(this.getWindowLocation().href));
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
                var windowLocation, copyProps, prop, i, newLocation;
                windowLocation = this._windowLocation || window.location; // Allow stubbing for unit testing

                // Has the device missed the route off the href? Fix this.
                if (windowLocation.hash && windowLocation.hash.length > 1 && windowLocation.href && windowLocation.href.lastIndexOf('#') === -1) {
                    // Copy properties to new object, as modifying href on the original window.location triggers a navigation.
                    newLocation = {};
                    copyProps = ['assign', 'hash', 'host', 'href', 'pathname', 'protocol', 'search'];
                    for (i = 0; i < copyProps.length; i++) {
                        prop = copyProps[i];
                        if (windowLocation.hasOwnProperty(prop)) {
                            newLocation[prop] = windowLocation[prop];
                        }
                    }
                    newLocation.href = newLocation.href + newLocation.hash;
                }

                // Use copy of window.location if it was created, otherwise the original.
                return newLocation || windowLocation;
            },
            /**
             * Browse to the specified location. Use launchAppFromURL() and setCurrentRoute() under Application
             * to manipulate the current location more easily.
             * @param {String} url Full URL to navigate to, including search and hash if applicable.
             */
            setWindowLocationUrl: function(url) {
                var windowLocation = this._windowLocation || window.location; // Allow stubbing for unit testing

                // Prefer assign(), but some devices don't have this function.
                if (typeof windowLocation.assign === 'function') {
                    windowLocation.assign(url);
                } else {
                    windowLocation.href = url;
                }
            },
            /**
             * Gets the reference (e.g. URL) of the resource that launched the application.
             * @returns A reference (e.g. URL) of the resource that launched the application.
             */
            getReferrer: function() {
                return document.referrer;
            },
            /**
             * Forces the device to pre-load an image.
             * @param {String} url The URL of the image to preload.
             */
            preloadImage: function(url) {
                var img = new Image();
                img.src = url;
            },
            /**
             * Checks to see if HD output is currently enabled.
             * @returns True if HD is currently enabled.
             */
            isHDEnabled: function() {
                return true;
            }
        });
    }
);
