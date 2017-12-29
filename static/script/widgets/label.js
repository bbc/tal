/**
 * @fileOverview Requirejs module containing the antie.widgets.Label class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/label',
    ['antie/widgets/widget'],
    function(Widget) {
        'use strict';

        /**
         * The Label widget displays text. It supports auto-truncation (with ellipsis) of text to fit.
         * @name antie.widgets.Label
         * @class
         * @extends antie.widgets.Widget
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         * @param {String} [text] The text content of this label.
         */
        var Label = Widget.extend(/** @lends antie.widgets.Label.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (id, text, enableHTML) {
                // The current API states that if only one parameter is passed to
                // use that value as the text and auto generate an internal id
                if(arguments.length === 1) {
                    this._text = id;
                    init.base.call(this);
                } else {
                    this._text = text;
                    init.base.call(this, id);
                }
                this._truncationMode = Label.TRUNCATION_MODE_NONE;
                this._maxLines = 0;
                this._enableHTML = enableHTML || false;
                this._width = 0;
                this.addClass('label');
            },
            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function render (device) {
                // TODO: is there a more efficient way of doing this?
                var s = this.getTextAsRendered(device);

                if(!this.outputElement) {
                    this.outputElement = device.createLabel(this.id, this.getClasses(), s, this._enableHTML);
                } else {
                    device.setElementContent(this.outputElement, s, this._enableHTML);
                }

                return this.outputElement;
            },
            
            /**
             * Will return text as rendered on the device
             * @param {antie.devices.Device} device The device to render to.
             * @returns A string that will be displayed in the label after truncation, etc...
             */
            getTextAsRendered: function(device) {
                var s;
                if(this._width && this._maxLines && this._text && (this._truncationMode === Label.TRUNCATION_MODE_RIGHT_ELLIPSIS)) {
                    var h = device.getTextHeight('fW', this._width, this.getClasses());
                    var allowedHeight = h * this._maxLines;
                    var currentHeight = device.getTextHeight(this._text, this._width, this.getClasses());

                    var len = this._text.length;
                    while(currentHeight > allowedHeight && len > 1) {
                        len = Math.floor((len * allowedHeight) / currentHeight);
                        currentHeight = device.getTextHeight(this._text.substring(0, len) + '...', this._width, this.getClasses());
                    }
                    while(currentHeight <= allowedHeight && len <= this._text.length) {
                        len++;
                        currentHeight = device.getTextHeight(this._text.substring(0, len) + '...', this._width, this.getClasses());
                    }
                    len--;

                    if(len < this._text.length) {
                        // truncate at word boundary
                        var boundaryLen = len;
                        while(boundaryLen && !/\w\W$/.test(this._text.substring(0, boundaryLen+1))) {
                            boundaryLen--;
                        }
                        if(boundaryLen > 0) {
                            s = this._text.substring(0, boundaryLen) + '...';
                        } else {
                            s = this._text.substring(0, len) + '...';
                        }
                    } else {
                        s = this._text;
                    }
                } else {
                    s = this._text;
                }
                return s;
            },
            
            /**
             * Sets the text displayed by this label.
             * @param {String} text The new text to be displayed.
             */
            setText: function setText (text) {
                this._text = text;
                if(this.outputElement) {
                    this.render(this.getCurrentApplication().getDevice());
                }
            },
            /**
             * Gets the current text displayed by this label.
             * @returns The current text displayed by this label.
             */
            getText: function getText () {
                return this._text;
            },
            /**
             * Sets the truncation mode (currently {@link antie.widgets.Label.TRUNCATION_MODE_NONE} or {@link antie.widgets.Label.TRUNCATION_MODE_RIGHT_ELLIPSIS}).
             *
             * @deprecated TRUNCATION_MODE_RIGHT_ELLIPSIS relies on browserdevice.getTextHeight(), which can be inaccurate.
             * @param {String} mode The new truncation mode.
             */
            setTruncationMode: function setTruncationMode (mode) {
                this._truncationMode = mode;
            },
            /**
             * Sets the maximum lines displayed when a truncation mode is set.
             * @param {String} lines The maximum number of lines to display.
             */
            setMaximumLines: function setMaximumLines (lines) {
                this._maxLines = lines;
            },
            /**
             * Sets the width of this label for use with truncation only.
             * @param {Integer} width The width of this label in pixels
             */
            setWidth: function setWidth (width) {
                this._width = width;
            }
        });

        /**
         * Do not truncate the text. Let the browser wrap to as many lines required to display all the text.
         * @name TRUNCATION_MODE_NONE
         * @memberOf antie.widgets.Label
         * @constant
         * @static
         */
        Label.TRUNCATION_MODE_NONE = 0;
        /**
         * Truncate text to fit into the number of lines specified by {@link antie.widgets.Label#setMaximumLines} by removing characters at the end of the string and append an ellipsis if text is truncated.
         * @constant
         * @name TRUNCATION_MODE_RIGHT_ELLIPSIS
         * @memberOf antie.widgets.Label
         * @static
         */
        Label.TRUNCATION_MODE_RIGHT_ELLIPSIS = 1;

        return Label;
    }
);
