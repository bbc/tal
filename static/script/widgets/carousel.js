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

require.def('antie/widgets/carousel',
    [
        'antie/widgets/carousel/carouselcore',
        'antie/widgets/container'
    ],
    function (CarouselCore, Container) {
        "use strict";
        var Carousel = CarouselCore.extend({

            appendChildWidget: function (widget) {
                return this.append(widget);
            },

            insertChildWidget: function (index, widget) {
                return this.insert(index, widget);
            },

            removeChildWidget: function (widget, retainElement) {
                return this.remove(widget, retainElement);
            },

            setActiveChildWidget: function (widget) {
                if (widget === this._mask) {
                    return this._super(widget);
                } else {
                    return this.setActiveWidget(widget);
                }
            },

            hasChildWidget: function (id) {
                if (id === this._mask.id) {
                    return this._super(id);
                } else {
                    return this._widgetStrip.hasChildWidget(id);
                }
            },

            getActiveChildWidget: function () {
                return this._widgetStrip.getActiveChildWidget();
            },

            getChildWidget: function (id) {
                if (id === this._mask.id) {
                    return this._mask;
                } else {
                    return this._widgetStrip.getChildWidget(id);
                }
            },

            getChildWidgetCount: function () {
                return this._widgetStrip.getChildWidgetCount();
            },

            getChildWidgets: function () {
                return this.items();
            },

            setActiveChildIndex: function (index) {
                return this.setActiveIndex(index);
            },

            getActiveChildIndex: function () {
                return this.getActiveIndex();
            },

            addClass: function (className) {
                if (this._widgetStrip) {
                    return this._widgetStrip.addClass(className);
                }
            },

            hasClass: function (className) {
                if (this._widgetStrip) {
                    return this._widgetStrip.hasClass(className);
                } else {
                    return false;
                }
            },

            removeClass: function (className) {
                if (this._widgetStrip) {
                    return this._widgetStrip.removeClass(className);
                }
            },

            getClasses: function () {
                if (this._widgetStrip) {
                    return this._widgetStrip.getClasses();
                } else {
                    return [];
                }
            },

            _directAppend: function (widget) {
                Container.prototype.appendChildWidget.call(this, widget);
            }
        });

        Carousel.orientations = CarouselCore.orientations;
        return Carousel;

    }
);