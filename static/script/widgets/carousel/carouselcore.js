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
		 * The Carousel widget extends the container widget to manage a carousel of any orientation
		 * @name antie.widgets.CarouselCore
		 * @class
		 * @extends antie.widgets.Widget
		 */
		var Carousel = Container.extend(/** @lends antie.widgets.Container.prototype */ {
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
                this._setAlignEventsFromMaskToHaveCarouselAsTarget();
                this._autoCalculate = true;
			},

			render: function (device) {
                this.outputElement = this._mask.render(device);
				return this.outputElement;
			},

			append: function (widget) {
                widget.addClass('carouselItem');
				return this._widgetStrip.append(widget);
			},

            insert: function (index, widget) {
                widget.addClass('carouselItem');
                return this._widgetStrip.insert(index, widget);
            },

            remove: function (widget, retainElement) {
                if (this.hasChildWidget(widget.id)) {
                    widget.removeClass('carouselItem');
                    return this._widgetStrip.remove(widget, retainElement);
                }
            },

            removeAll: function () {
                this._widgetStrip.removeAll();
            },

			alignNext: function () {
                this._aligner.alignNext(this._navigator);
			},

            alignPrevious: function () {
                this._aligner.alignPrevious(this._navigator);
			},

            alignToIndex: function (index, options) {
                this._aligner.alignToIndex(index, options);
            },

            setAlignPoint: function (pixelsFromEdgeToWidgetEdge) {
                this._mask.setAlignPoint(pixelsFromEdgeToWidgetEdge);
            },

            recalculate: function () {
                this._widgetStrip.recalculate();
            },

            autoCalculate: function (on) {
                this._widgetStrip.autoCalculate(on);
            },

            getActiveIndex: function () {
                return this._navigator.currentIndex();
            },

            setActiveIndex: function (index) {
                this._navigator.setIndex(index);
            },

            nextIndex: function () {
                return this._navigator.nextIndex();
            },

            previousIndex: function () {
                return this._navigator.previousIndex();
            },

            setActiveWidget: function (widget) {
                var index;
                index = this._widgetStrip.getIndexOfChildWidget(widget);
                this._navigator.setIndex(index);
            },

            setNavigator: function (Navigator) {
                this._navigator = new Navigator(this._widgetStrip);
            },

            setWidgetStrip: function (WidgetStrip) {
                this._widgetStrip = new WidgetStrip(this.id + '_WidgetStrip', this._orientation);
                if (this._navigator) {
                    this._navigator.setContainer(this._widgetStrip);
                }
                if (this._mask) {
                    this._mask.setWidgetStrip(this._widgetStrip);
                }

            },

            items: function () {
                return this._widgetStrip.widgets();
            },

            orientation: function () {
                return this._orientation;
            },

            _setOrientation: function (orientation) {
                this._orientation = orientation;
            },

            _setAlignEventsFromMaskToHaveCarouselAsTarget: function () {
                var self = this;
                this.addEventListener('beforealign', function (ev) {
                    if (ev.target === self._mask) {
                        ev.target = self;
                    }
                });
                this.addEventListener('afteralign', function (ev) {
                    if (ev.target === self._mask) {
                        ev.target = self;
                    }
                });
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
