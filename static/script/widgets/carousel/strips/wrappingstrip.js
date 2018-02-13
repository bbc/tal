/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.wrappingstrip class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/strips/wrappingstrip',
    [
        'antie/widgets/carousel/strips/widgetstrip'
    ],
    function (WidgetStrip) {
        'use strict';
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
            init: function init (id, orientation) {
                init.base.call(this, id, orientation);
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
            render: function render (device) {
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
            append: function append (widget, length) {
                append.base.call(this, widget, length);
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
            insert: function insert (index, widget, length) {
                insert.base.call(this, index, widget, length);
                this._recalculateIfAuto();
            },

            /**
             * Removes a widget from the strip
             * @param {antie.widgets.Widget} widget Widget to remove from the strip
             * @param {Boolean} [retainElement=false] Whether to keep the widget's output element in the DOM after removing widget
             */
            remove: function remove (widget, retainElement) {
                remove.base.call(this, widget, retainElement);
                this._recalculateIfAuto();
            },

            /**
             * @param index
             * @returns {Number} length in pixels along primary axis to primary edge of the provided index
             * i.e. from the left edge of the strip to the left edge of the widget in a horizontal carousel
             */
            getLengthToIndex: function getLengthToIndex (index) {
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
            getChildElements: function getChildElements () {
                return this._elements;
            },

            /**
             * Removes any existing clones and appends sufficient clones to either end to allow for visual wrapping
             */
            recalculate: function recalculate () {
                this._removeClones();
                this._createClones(this._getMaskLength());
            },

            /**
             * Toggles auto calculation of clones when necessary (i.e. after an append or remove)
             * @param {Boolean} on If on === true clones will be recalculated after append, remove or insert. If set false
             * they will not be recalculated unless recalculate is called.
             */
            autoCalculate: function autoCalculate (on) {
                if (typeof on === 'boolean') {
                    this._autoCalculate = on;
                }
            },

            /**
             * @param index
             * @returns {Number} The primary length of the widget at the specified index. (width for horizontal, height for vertical)
             */
            lengthOfWidgetAtIndex: function lengthOfWidgetAtIndex (index) {
                var providedLength;
                providedLength = this._lengthOfWidgetAtIndexUsingSuppliedValues(index);
                if (typeof providedLength === 'number') {
                    return providedLength;
                }
                return this._getElementLength(this._elements[index + this._elementIndexOffset]);
            },

            _lengthToIndexUsingSuppliedValues: function _lengthToIndexUsingSuppliedValues (/*index*/) {
                return null;
            },

            _lengthOfWidgetAtIndexUsingSuppliedValues: function _lengthOfWidgetAtIndexUsingSuppliedValues (/*index*/) {
                return null;
            },

            _refereshWidgetElements: function _refereshWidgetElements () {
                var widgets, i;
                this._widgetElements = [];
                widgets = this.getChildWidgets();
                for (i = 0; i !== widgets.length; i += 1) {
                    this._widgetElements.push(widgets[i].outputElement || widgets[i].render(this._getDevice()));
                }
            },

            _recalculateIfAuto: function _recalculateIfAuto () {
                if (this._autoCalculate === true) {
                    this.recalculate();
                }
            },

            _refreshElements: function _refreshElements () {
                this._refereshWidgetElements();
                this._elements = this._prependedClones.concat(this._widgetElements.concat(this._appendedClones));
                this._elementIndexOffset = this._getPrependedClones().length;
            },

            _getLengthOfElementArrayUpToIndex: function _getLengthOfElementArrayUpToIndex (elementArray, index) {
                var elementsUpToIndex, endIndex;
                endIndex = this._getValidatedIndex(elementArray, index);
                elementsUpToIndex = elementArray.slice(0, endIndex + 1);
                return this._getOffsetToLastElementInArray(elementsUpToIndex);
            },

            _firstFocusableIndex: function _firstFocusableIndex (widgets) {
                var i, focusableIndex;
                i = 0;
                focusableIndex = null;
                while (focusableIndex === null && i !== widgets.length) {
                    focusableIndex = widgets[i].isFocusable() ? i : null;
                    i += 1;
                }
                return focusableIndex;
            },

            _createClones: function _createClones (maskLength) {
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

            _cloneFrontItems: function _cloneFrontItems (widgets, maskLength) {
                var firstFocusableIndex, requiredLength, clones;
                clones = [];
                firstFocusableIndex = this._firstFocusableIndex(widgets);
                if (firstFocusableIndex !== null) {
                    requiredLength = maskLength + this.getLengthToIndex(firstFocusableIndex);
                    clones = this._cloneFromIndexToLength(widgets, 0, requiredLength);
                }
                return clones;
            },

            _cloneRearItems: function _cloneRearItems (widgets, maskLength) {
                function shallowCloneArray(arr) {
                    return arr.slice(0);
                }
                var reversedWidgets;
                reversedWidgets = shallowCloneArray(widgets);
                reversedWidgets.reverse();
                return this._cloneFrontItems(reversedWidgets, maskLength);
            },

            _cloneFromIndexToLength: function _cloneFromIndexToLength (widgets, startIndex, length) {
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

            _cloneWidget: function _cloneWidget (widget) {
                return this._cloneElement(widget.outputElement);
            },

            _cloneElement: function _cloneElement (element) {
                var device, clone;
                device = this._getDevice();
                clone = device.cloneElement(element, true, 'carouselclone', '_CarouselClone');
                this._removeStateStylesFromElement(clone);
                return clone;
            },

            _removeStateStylesFromElement: function _removeStateStylesFromElement (element) {
                var device;
                device = this.getCurrentApplication().getDevice();
                device.removeClassFromElement(element, 'focus', true);
                device.removeClassFromElement(element, 'active', true);
                device.removeClassFromElement(element, 'buttonFocussed', true);
            },

            _removeClones: function _removeClones () {
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

            _getPrependedClones: function _getPrependedClones () {
                return this._prependedClones;
            },

            _getAppendedClones: function _getAppendedClones () {
                return this._appendedClones;
            },

            _getClones: function _getClones () {
                return this._clones;
            },

            _getMaskLength: function _getMaskLength () {
                return this.parentWidget.getLength();
            }
        });
    }
);
