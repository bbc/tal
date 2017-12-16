/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.cullingstrip class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/strips/cullingstrip',
    [
        'antie/widgets/carousel/strips/widgetstrip',
        'antie/widgets/carousel/strips/utility/widgetcontext',
        'antie/widgets/carousel/strips/utility/states'
    ],
    function (WidgetStrip, WidgetContext, STATES) {
        'use strict';
        var CullingStrip;
        /**
         * A container for the widgets displayed within a carousel, in which widgets are only created when they
         * come into view, and where widgets are removed from the DOM when they go out of view
         * @name antie.widgets.carousel.strips.CullingStrip
         * @class
         * @extends antie.widgets.carousel.strips.WidgetStrip
         * @param {String} id The unique ID of the widget.
         * @param {Object} orientation an object representing the strip's orientation.
         * One of antie.widgets.carousel.orientations.Horizontal or antie.widgets.carousel.orientations.Vertical
         */
        CullingStrip = WidgetStrip.extend(/** @lends antie.widgets.carousel.strips.CullingStrip.prototype */{
            init: function init (id, orientation) {
                init.base.call(this, id, orientation);
                this.setAutoRenderChildren(false);
                this._widgetContexts = [];
            },

            append: function append (widget, length) {
                append.base.call(this, widget, length);
                this._widgetContexts.push(this.createContext(widget, this));
            },

            render: function render (device) {
                var i, context;
                if (!this.outputElement) {
                    this.outputElement = device.createContainer(this.id, this.getClasses());
                } else {
                    device.clearElement(this.outputElement);
                }
                for (i = 0; i !== this._widgetContexts.length; i += 1) {
                    context = this._widgetContexts[i];
                    context.setState('INIT');
                }
                return this.outputElement;
            },

            insert: function insert (index, widget, length) {
                insert.base.call(this, index, widget, length);
                this._widgetContexts.splice(index, 0, this.createContext(widget, this));
            },

            remove: function remove (widget) {
                var i, widgets, returnValue;
                widgets = this.widgets();
                for (i = 0; i !== widgets.length; i += 1) {
                    if (widget === widgets[i]) {
                        this._widgetContexts.splice(i, 1);
                    }
                }
                returnValue = remove.base.call(this, widget, false);

                return returnValue;
            },

            removeAll: function removeAll () {
                this._widgetContexts = [];
                removeAll.base.call(this);
            },

            needsVisibleIndices: function needsVisibleIndices () {
                return this._widgetContexts.length > 0;
            },

            attachIndexedWidgets: function attachIndexedWidgets (indexArray) {
                var i, itemIndex, indexSet, firstIndexInView, preIndices, postIndices;
                indexSet = {};
                firstIndexInView = this._firstIndexInView();
                preIndices = [];
                postIndices = [];
                for (i = 0; i !== indexArray.length; i += 1) {
                    itemIndex = indexArray[i];
                    indexSet[itemIndex] = true;
                    if (itemIndex < firstIndexInView) {
                        preIndices.push(itemIndex);
                    } else {
                        postIndices.push(itemIndex);
                    }
                }
                this._detatchWidgetsNotIndexed(indexSet);
                preIndices.reverse();
                for (i = 0; i !== preIndices.length; i += 1) {
                    itemIndex = preIndices[i];
                    this._widgetContexts[itemIndex].prepend();
                }
                for (i = 0; i !== postIndices.length; i += 1) {
                    itemIndex = postIndices[i];
                    this._widgetContexts[itemIndex].append();
                }
            },

            /**
             * Get the distance in pixels to a widget at the supplied index
             * @param {Number} index An index of a widget currently in the carousel
             * @returns {Number} length in pixels along primary axis to primary edge of the provided index
             * i.e. from the left edge of the strip to the left edge of the widget in a horizontal carousel
             * @throws {Error} if the indexed widget has not had a length set on append/insert or via setLengths
             */
            getLengthToIndex: function getLengthToIndex (index) {
                var firstAttached, i, length, totalLength;
                totalLength = 0;
                firstAttached = this._firstIndexWithLength();
                for (i = firstAttached; i < index; i += 1) {
                    length = this._lengths[i];
                    if (length === undefined) {
                        this._throwNoLengthError();
                    }
                    totalLength += length;
                }
                return totalLength;
            },

            /**
             * Gets the length in pixels of the widget at the supplied index.
             * @param {Number} index The index of a widget currently appended to the carousel. Supplied index must be valid (i.e. correspond to a widget currently in the strip with a provided length)
             * @returns {Number} the length in pixels of the widget at the supplied index. Returns the length supplied at append or via setWidgetLength
             * @throws {Error} if the indexed widget has not had a length set on append/insert or via setLengths
             */
            lengthOfWidgetAtIndex: function lengthOfWidgetAtIndex (index) {
                if (this._lengths[index] !== undefined) {
                    return this._lengths[index];
                } else {
                    this._throwNoLengthError();
                }
            },

            createContext: function createContext (widget, parent) {
                return new WidgetContext(widget, parent, STATES);
            },

            _detatchWidgetsNotIndexed: function _detatchWidgetsNotIndexed (indexSet) {
                var i;
                for (i = 0; i !== this._widgetContexts.length; i += 1) {
                    if (!indexSet.hasOwnProperty(i)) {
                        this._widgetContexts[i].detach();
                    }
                }
            },

            _firstIndexWithLength: function _firstIndexWithLength () {
                var i, attached, firstAttachedIndex;
                i = 0;
                attached = false;
                while (i < this._widgetContexts.length && attached === false) {
                    attached = this._widgetContexts[i].hasLength();
                    firstAttachedIndex = i;
                    i += 1;
                }
                return firstAttachedIndex;
            },

            _firstIndexInView: function _firstIndexInView () {
                var i, inView, firstInView;
                i = 0;
                inView = false;
                while (i < this._widgetContexts.length && inView === false) {
                    inView = this._widgetContexts[i].inView();
                    firstInView = i;
                    i += 1;
                }
                return firstInView;
            },

            _throwNoLengthError: function _throwNoLengthError () {
                throw new Error('You must set widget lengths before aligning culling strip');
            }
        });
        return CullingStrip;
    }
);
