/**
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
require.def('antie/widgets/carousel/strips/wrappingstrip',
    [
        'antie/widgets/carousel/strips/widgetstrip'
    ],
    function (WidgetStrip) {
        "use strict";
        /**
         * A container for the widgets displayed within a carousel
         * @name antie.widgets.carousel.strips.WrappingStrip
         * @class
         * @extends antie.widgets.carousel.strips.WidgetStrip
         * @param {String} id The unique ID of the widget.
         * @param {Object} orientation an object representing the strip's orientation.
         * One of antie.widgets.carousel.orientations.Horizontal or antie.widgets.carousel.orientations.Vertical
         */
        return WidgetStrip.extend(/** @lends antie.widgets.carousel.strips.WrappingStrip.prototype */{
            /**
             * @constructor
             * @ignore
             */
            init: function (id, orientation) {
                this._super(id, orientation);
                this._clones = [];
                this._prependedClones = [];
                this._appendedClones = [];
                this._widgetElements = [];
                this._elements = [];
                this._elementIndexOffset = 0;
                this.addClass('carouselwidgetstrip');
                this._autoCalculate = true;
            },

            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function (device) {
                var i;
                if (!this.outputElement) {
                    this.outputElement = device.createContainer(this.id, this.getClasses());
                } else {
                    device.clearElement(this.outputElement);
                }
                for (i = 0; i !== this._elements.length; i++) {
                    device.appendChildElement(this.outputElement, this._elements[i]);
                }
                return this.outputElement;
            },

            /**
             * Adds a widget to the end of the strip.
             * Note will cause clone recalculation unless autoCalculate has been set to false
             * @param {antie.widgets.Widget} widget The widget to append to the strip
             * @param {Number} [length] the length of the widget in pixels, measured along the primary axis.
             * (Height for a vertical strip or width for horizontal.) If providied, this value will be used in
             * positioning calculations rather then a calculated value (can be useful when widgets change size)
             * Note length only currently working with non-wrapping strips.
             */
            append: function (widget, length) {
                this._super(widget, length);
                this._recalculateIfAuto();
            },

            /**
             * Inserts widget within the strip
             * Note will cause clone recalculation unless autoCalculate has been set to false
             * @param {Number} index A zero based index to begin insertion at, i.e. 0 prepends.
             * @param {antie.widgets.Widget} widget The widget to append to the strip
             * @param {Number} [length] the length of the widget in pixels, measured along the primary axis.
             * (Height for a vertical strip or width for horizontal.) If provided, this value will be used in
             * positioning calculations rather then a calculated value (can be useful when widgets change size)
             * Note length only currently working with non-wrapping strips.
             */
            insert: function (index, widget, length) {
                this._super(index, widget, length);
                this._recalculateIfAuto();
            },

            /**
             * Removes a widget from the strip
             * @param {antie.widgets.Widget} widget. Widget to remove from the strip
             */
            remove: function (widget, retainElement) {
                this._super(widget, retainElement);
                this._recalculateIfAuto();
            },

            /**
             * @param index
             * @returns {Number} length in pixels along primary axis to primary edge of the provided index
             * i.e. from the left edge of the strip to the left edge of the widget in a horizontal carousel
             */
            getLengthToIndex: function (index) {
                var suppliedLength;
                suppliedLength = this._lengthToIndexUsingSuppliedValues(index);
                if (suppliedLength !== null) {
                    return suppliedLength;
                } else {
                    return this._getLengthOfElementArrayUpToIndex(this.getChildElements(), index + this._elementIndexOffset);
                }
            },

            /**
             * @returns {Array} elements an array of all elements appended to the strip (including clones)
             */
            getChildElements: function () {
                return this._elements;
            },

            /**
             * Removes any existing clones and appends sufficient clones to either end to allow for visual wrapping
             */
            recalculate: function () {
                this._removeClones();
                this._createClones(this._getMaskLength());
            },

            /**
             * Toggles auto calculation of clones when necessary (i.e. after an append or remove)
             * @param {Boolean} on If on === true clones will be recalculated after append, remove or insert. If set false
             * they will not be recalculated unless recalculate is called.
             */
            autoCalculate: function (on) {
                if (typeof on === 'boolean') {
                    this._autoCalculate = on;
                }
            },

            /**
             * @param index
             * @returns {Number} The primary length of the widget at the specified index. (width for horizontal, height for vertical)
             */
            lengthOfWidgetAtIndex: function (index) {
                var providedLength;
                providedLength = this._lengthOfWidgetAtIndexUsingSuppliedValues(index);
                if (typeof providedLength === 'number') {
                    return providedLength;
                }
                return this._getElementLength(this._elements[index + this._elementIndexOffset]);
            },

            _lengthToIndexUsingSuppliedValues: function (index) {
                return null;
            },

            _lengthOfWidgetAtIndexUsingSuppliedValues: function (index) {
                return null;
            },

            _refereshWidgetElements: function () {
                var widgets, i;
                this._widgetElements = [];
                widgets = this.getChildWidgets();
                for (i = 0; i !== widgets.length; i += 1) {
                    this._widgetElements.push(widgets[i].outputElement || widgets[i].render(this._getDevice()));
                }
            },

            _recalculateIfAuto: function () {
                if (this._autoCalculate === true) {
                    this.recalculate();
                }
            },

            _refreshElements: function () {
                this._refereshWidgetElements();
                this._elements = this._prependedClones.concat(this._widgetElements.concat(this._appendedClones));
                this._elementIndexOffset = this._getPrependedClones().length;
            },

            _getLengthOfElementArrayUpToIndex: function (elementArray, index) {
                var elementsUpToIndex, endIndex, length;
                endIndex = this._getValidatedIndex(elementArray, index);
                elementsUpToIndex = elementArray.slice(0, endIndex + 1);
                return this._getOffsetToLastElementInArray(elementsUpToIndex);
            },

            _firstFocusableIndex: function (widgets) {
                var i, focusableIndex;
                i = 0;
                focusableIndex = null;
                while (focusableIndex === null && i !== widgets.length) {
                    focusableIndex = widgets[i].isFocusable() ? i : null;
                    i += 1;
                }
                return focusableIndex;
            },

            _createClones: function (maskLength) {
                var widgets, device, clonesOfFrontItems, clonesOfRearItems, i;
                device = this.getCurrentApplication().getDevice();
                widgets = this.getChildWidgets();

                clonesOfFrontItems = this._cloneFrontItems(widgets, maskLength);
                for (i = 0; i !== clonesOfFrontItems.length; i += 1) {
                    device.appendChildElement(this.outputElement, clonesOfFrontItems[i]);
                }

                clonesOfRearItems = this._cloneRearItems(widgets, maskLength);
                for (i = 0; i !== clonesOfRearItems.length; i += 1) {
                    device.prependChildElement(this.outputElement, clonesOfRearItems[i]);
                }
                this._prependedClones = clonesOfRearItems.reverse();
                this._appendedClones = clonesOfFrontItems;
                this._clones = clonesOfRearItems.concat(clonesOfFrontItems);
                this._refreshElements();
            },

            _cloneFrontItems: function (widgets, maskLength) {
                var firstFocusableIndex, requiredLength, clones;
                clones = [];
                firstFocusableIndex = this._firstFocusableIndex(widgets);
                if (firstFocusableIndex !== null) {
                    requiredLength = maskLength + this.getLengthToIndex(firstFocusableIndex);
                    clones = this._cloneFromIndexToLength(widgets, 0, requiredLength);
                }
                return clones;
            },

            _cloneRearItems: function (widgets, maskLength) {
                function shallowCloneArray(arr) {
                    return arr.slice(0);
                }
                var reversedWidgets;
                reversedWidgets = shallowCloneArray(widgets);
                reversedWidgets.reverse();
                return this._cloneFrontItems(reversedWidgets, maskLength);
            },

            _cloneFromIndexToLength: function (widgets, startIndex, length) {
                var clones, clonedLength, i, widget;
                clones = [];
                clonedLength = 0;
                i = startIndex;
                while (clonedLength < length) {
                    widget = widgets[i];
                    clones.push(this._cloneWidget(widget));
                    clonedLength += this._getWidgetLength(widget);
                    i += 1;
                    if (i === widgets.length) {
                        i = 0;
                    }
                }
                return clones;
            },

            _cloneWidget: function (widget) {
                return this._cloneElement(widget.outputElement);
            },

            _cloneElement: function (element) {
                var device, clone;
                device = this._getDevice();
                clone = device.cloneElement(element, true, 'carouselclone', '_CarouselClone');
                this._removeStateStylesFromElement(clone);
                return clone;
            },

            _removeStateStylesFromElement: function (element) {
                var device;
                device = this.getCurrentApplication().getDevice();
                device.removeClassFromElement(element, 'focus', true);
                device.removeClassFromElement(element, 'active', true);
                device.removeClassFromElement(element, 'buttonFocussed', true);
            },

            _removeClones: function () {
                var i, clone, device;
                device = this.getCurrentApplication().getDevice();

                for (i = 0; i !== this._clones.length; i += 1) {
                    clone = this._clones[i];
                    device.removeElement(clone);
                }
                this._clones = [];
                this._prependedClones = [];
                this._appendedClones = [];
                this._refreshElements();
            },

            _getPrependedClones: function () {
                return this._prependedClones;
            },

            _getAppendedClones: function () {
                return this._appendedClones;
            },

            _getClones: function () {
                return this._clones;
            },

            _getMaskLength: function () {
                return this.parentWidget.getLength();
            }
        });
    }
);