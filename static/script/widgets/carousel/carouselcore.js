/**
 * @fileOverview Requirejs module containing the antie.widgets.Carousel abstract class.
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

require.def('antie/widgets/carousel/carouselcore',
	[
		'antie/widgets/container',
        'antie/widgets/carousel/navigators/bookendednavigator',
        'antie/widgets/carousel/mask',
        'antie/widgets/carousel/strips/widgetstrip',
        'antie/widgets/carousel/aligners/aligner',
        'antie/widgets/carousel/orientations/vertical',
        'antie/widgets/carousel/orientations/horizontal'
	],
	function (
        Container,
        BookendedNavigator,
        Mask,
        WidgetStrip,
        Aligner,
        verticalOrientation,
        horizontalOrientation
    ) {
		"use strict";
        /**
         * Ordered list of widgets that can be navigated by moving the list or the selection point
         * Use antie.widgets.Carousel instead if you need old container methods.
         * @name antie.widgets.carousel.CarouselCore
         * @class
         * @extends antie.widgets.Widget
         * @param {string} id The id of the carousel, id_CarouselMask will be used as the id for the mask element
         * and id_WidgetStrip will be used as the id of the widget strip element
         * @param {Object} [orientation=antie.widgets.carousel.CarouselCore.orientations.VERTICAL] the orientation object of
         * the carousel. Vertical by default, for horizontal pass in antie.widgets.carousel.CarouselCore.orientations.HORIZONTAL
         */
		var Carousel = Container.extend(/** @lends antie.widgets.carousel.CarouselCore.prototype */ {
            /**
             * @constructor
             * @ignore
             */
			init: function (id, orientation) {
				this.id = id;
				this._super(id);
                this._setOrientation(orientation || Carousel.orientations.VERTICAL);
                this.setWidgetStrip(WidgetStrip);
				this._mask = new Mask(this.id + '_CarouselMask', this._widgetStrip, this._orientation);
				this._directAppend(this._mask);
                this.setNavigator(BookendedNavigator);
                this._aligner = new Aligner(this._mask);
                this._setAlignEventsFromStripToHaveCarouselAsTarget();
                this._autoCalculate = true;
			},

            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the Carousel as displayed on the device
             * (in a browser, two nested DIVs with the inner containing child widgets and the outer acting as a mask);
             */
			render: function (device) {
                this.outputElement = this._mask.render(device);
				return this.outputElement;
			},

            /**
             * Adds a widget to the end of the carousel
             * @param {antie.widgets.Widget} widget The widget to append to the carousel
             * @param {Number} [length] the length of the widget in pixels, measured along the primary axis.
             * (Height for a vertical carousel or width for horizontal.) If providied, this value will be used in
             * positioning calculations rather then a calculated value (can be useful when widgets change size)
             * Note length only currently working with non-wrapping strips.
             */
			append: function (widget, length) {
                widget.addClass('carouselItem');
				return this._widgetStrip.append(widget, length);
			},

            /**
             * Adds a widget to the end of the carousel
             * @param {Number} index A zero based index to begin insertion at, i.e. 0 prepends.
             * @param {antie.widgets.Widget} widget The widget to append to the carousel
             * @param {Number} [length] the length of the widget in pixels, measured along the primary axis.
             * (Height for a vertical carousel or width for horizontal.) If provided, this value will be used in
             * positioning calculations rather then a calculated value (can be useful when widgets change size)
             * Note length only currently working with non-wrapping strips.
             */
            insert: function (index, widget, length) {
                widget.addClass('carouselItem');
                return this._widgetStrip.insert(index, widget, length);
            },

            /**
             * Manually sets lengths of elements for movement calculations - useful for elements which change size while moving.
             * @param lengths {number} | {Array} If provided with a number all lengths will be set equal to this number
             * If provided with an array, the lengths will be set with the corresponding widgets (so the first number will be used
             * for the first widget's length, etc..)
             * Note only currently working with non-wrapping strips.
             */
            setWidgetLengths: function (lengths) {
                this._widgetStrip.setLengths(lengths);
            },

            /**
             * Manually sets length of te Mask. Normally this is measured from the DOM, but if the first alignment happens before
             * the DOM is ready, then culling strips may not get populated. In this case, call this first with the size in pixels of
             * the mask.
             * @param length {number} The length in pixels to use in Mask calculations.
             */
            setMaskLength: function (length) {
                this._mask.setLength(length);
            },

            /**
             * Removes a widget from the carousel
             * @param {antie.widgets.Widget} widget. Widget to remove from the DOM
             */
            remove: function (widget, retainElement) {
                if (this.hasChildWidget(widget.id)) {
                    widget.removeClass('carouselItem');
                    return this._widgetStrip.remove(widget, retainElement);
                }
            },

            /**
             * Removes all widgets from the carousel
             */
            removeAll: function () {
                this._widgetStrip.removeAll();
            },

            /**
             * Aligns the carousel to the next enabled widget after that currently aligned.
             * If no alignment has been performed previously it will align to the next enabled widget after that at index 0
             * If a wrapping strip and navigator are used the alignment will wrap to the start after the last widget is reached.
             * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
             * @param {Object} [options] An animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
			alignNext: function (options) {
                this._aligner.alignNext(this._navigator, options);
			},

            /**
             * Aligns the carousel to the enabled widget before that currently aligned.
             * If no alignment has been performed previously it will align to the first enabled widget before that at index 0
             * If a wrapping strip and navigator are used the alignment will wrap to the end after the first widget is reached.
             * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
             * @param {Object} [options] An animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
            alignPrevious: function (options) {
                this._aligner.alignPrevious(this._navigator, options);
			},

            /**
             * Aligns the carousel to the widget at the specified index
             * Will always move forward if the index is after that currently aligned and backwards if index is before
             * that currently aligned.
             * If an alignment is in progress, the new alignment will be queued to start after the current alignment completes.
             * @param {Number} index The index of the widget to align on.
             * @param {Object} [options] An animation options object
             * @param {Number} [options.fps] The frames per second of the alignment, if using styletopleft animation
             * @param {Number} [options.duration] The duration of the alignment in ms
             * @param {String} [options.easing] The alignment easing function
             * @param {Boolean} [options.skipAnim] If set true, the alignment will complete instantly then fire any provided callback
             * @param {Function} [options.onComplete] A function which will be executed on completion of the alignment animation.
             */
            alignToIndex: function (index, options) {
                this._aligner.alignToIndex(index, options);
            },

            /**
             * Instantly completes any in-flight alignment animations, firing any callbacks that were provided.
             * If several alignments have been queued, all will complete in order.
             */
            completeAlignment: function () {
                this._aligner.complete();
            },

            /**
             * Sets the point along the Mask at which alignments are made
             * @param pixelsFromEdgeToWidgetEdge A value in pixels from the primary edge (top or left for Vertical/Horizontal)
             * at which widgets are aligned.
             */
            setAlignPoint: function (pixelsFromEdgeToWidgetEdge) {
                this._mask.setAlignPoint(pixelsFromEdgeToWidgetEdge);
            },

            /**
             * Sets the point along the Mask at which alignments are made
             * @param fractionOfMaskLength a value between 0 and 1 specifying how far along the mask a widget should
             * be aligned. i.e. 0.5 is the centre of the mask.
             */
            setNormalisedAlignPoint: function (fractionOfMaskLength) {
                this._mask.setNormalisedAlignPoint(fractionOfMaskLength);
            },

            /**
             * Sets the point along the aligned widget at which alignments are made
             * @param fractionOfWidgetLength a value between 0 and 1 specifying the point along the widget which will be
             * aligned with the mask alignment point. i.e. in a horizontal Carousel, 0.5 is the centre of the widget,
             * 0 is the left edge, 1 is the right edge
             */
            setNormalisedWidgetAlignPoint: function (fractionOfWidgetLength) {
                this._mask.setNormalisedWidgetAlignPoint(fractionOfWidgetLength);
            },

            /**
             * Some widget strips peform calculations which require elements to be present in the document.
             * This method manually performs those recalculations.
             */
            recalculate: function () {
                this._widgetStrip.recalculate();
            },

            /**
             * Some widget strips peform calculations which require elements to be present in the document.
             * By default these calculations are performed whenever their values might be invalidated (after appending elements
             * for instance) This method can be used to be disable/enable this behaviour for performance optimisation.
             */
            autoCalculate: function (on) {
                this._widgetStrip.autoCalculate(on);
            },

            /**
             * @returns the index of the currently active widget
             */
            getActiveIndex: function () {
                return this._navigator.currentIndex();
            },

            /**
             * Sets the currently active index
             * @param {Number} index the index of the widget to be made active.
             * If this is invalid or corresponds to a disabled widget the active index will not change
             */
            setActiveIndex: function (index) {
                this._navigator.setIndex(index);
            },

            /**
             * @returns the index first focussable index after the index of the active widget
             */
            nextIndex: function () {
                return this._navigator.nextIndex();
            },

            /**
             * @returns the index first focussable index before the index of the active widget
             */
            previousIndex: function () {
                return this._navigator.previousIndex();
            },

            /**
             * Sets the currently active widget
             * @param {antie.widgets.Widget} widget the widget to be made active.
             * If the widget is not in the Carousel or corresponds to a disabled widget the active widget will not change
             */
            setActiveWidget: function (widget) {
                var index;
                index = this._widgetStrip.getIndexOfChildWidget(widget);
                this._navigator.setIndex(index);
            },

            /**
             * Sets the navigator class used to determine focus position
             * @param {Function} Navigator the constructor function of the type of navigator the carousel should use, e.g.
             * antie.widgets.carousel.navigators.BookendedNavigator or antie.widgets.carousel.navigators.WrappingNavigator
             * On construction, the carousel uses antie.widgets.carousel.navigators.BookendedNavigator by default
             */
            setNavigator: function (Navigator) {
                this._navigator = new Navigator(this._widgetStrip);
            },

            /**
             * Sets the widget strip class used to manage widgets and elements within the carousel
             * @param {Function} WidgetStrip the constructor function of the type of Widget strip the carousel should use, e.g.
             * antie.widgets.carousel.navigators.WidgetStrip, antie.widgets.carousel.navigators.WrappingStrip
             * On construction, the carousel uses antie.widgets.carousel.navigators.WidgetStrip by default
             */
            setWidgetStrip: function (WidgetStrip) {
                this._widgetStrip = new WidgetStrip(this.id + '_WidgetStrip', this._orientation);
                if (this._navigator) {
                    this._navigator.setContainer(this._widgetStrip);
                }
                if (this._mask) {
                    this._mask.setWidgetStrip(this._widgetStrip);
                }

            },

            /**
             * @returns {Array} The widgets currently in the carousel
             */
            items: function () {
                return this._widgetStrip.widgets();
            },

            /**
             * @returns {Object} The orientation object associated with the carousel
             */
            orientation: function () {
                return this._orientation;
            },

            _setOrientation: function (orientation) {
                this._orientation = orientation;
            },

            _setAlignEventsFromStripToHaveCarouselAsTarget: function () {
                this._remapWidgetStripEventToCarousel('beforealign');
                this._remapWidgetStripEventToCarousel('afteralign');
            },

            _remapWidgetStripEventToCarousel: function (eventName) {
                var self = this;
                this._remapEvent = this._remapEvent || function (evt) {
                    if (evt.target === self._widgetStrip) {
                        evt.target = self;
                    }
                };
                this.addEventListener(eventName, this._remapEvent);
            },

            _directAppend: function (widget) {
                return this.appendChildWidget(widget);
            }
		});

        Carousel.orientations = {
            VERTICAL: verticalOrientation,
            HORIZONTAL: horizontalOrientation
        };
		return Carousel;
	}
);
