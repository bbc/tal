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
        return WidgetStrip.extend({

            init: function (id, orientation) {
                this._super(id, orientation);
                this._clones = [];
                this._prependedClones = [];
                this._appendedClones = [];
                this._widgetElements = [];
                this._elements = [];
                this._elementIndexOffset = 0;
                this.addClass('carouselwidgetstrip');
            },

            append: function (widget) {
                this._removeClones();
                this._addWidget(widget);
                this._createClones(this._getMaskLength());
            },

            insert: function (index, widget) {
                this._removeClones();
                this._super(index, widget);
                this._createClones(this._getMaskLength());
                this._refereshWidgetElements();
            },

            remove: function (widget, retainElement) {
                this._removeClones();
                this._super(widget, retainElement);
                this._createClones(this._getMaskLength());
                this._refereshWidgetElements();
            },

            getLengthToIndex: function (index) {
                return this._getLengthOfElementArrayUpToIndex(this.getChildElements(), index + this._elementIndexOffset);
            },

            getChildElements: function () {
                return this._elements;
            },

            _refereshWidgetElements: function () {
                var widgets, i;
                this._widgetElements = [];
                widgets = this.getChildWidgets();
                for (i = 0; i !== widgets.length; i += 1) {
                    this._widgetElements.push(widgets[i].outputElement);
                }
            },

            _addWidget: function (widget) {
                this.appendChildWidget(widget);
                this._refreshElements();
            },

            _refreshElements: function () {
                this._refereshWidgetElements();
                this._elements = this._prependedClones.concat(this._widgetElements.concat(this._appendedClones));
                this._elementIndexOffset = this._getPrependedClones().length;
            },

            _getLengthOfElementArrayUpToIndex: function (elementArray, index) {
                var lengthOfElements, elementSize, element, i, device;
                if (index < 0) {
                    index = 0;
                }
                if (index > elementArray.length) {
                    index = elementArray.length;
                }
                device = this.getCurrentApplication().getDevice();
                lengthOfElements = 0;
                for (i = 0; i !== index; i += 1) {
                    element = elementArray[i];
                    elementSize = device.getElementSize(element);
                    lengthOfElements += elementSize[this._getDimension()];
                }
                return lengthOfElements;
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
                this._prependedClones = clonesOfRearItems;
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