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
require.def('antie/widgets/carousel/strips/widgetstrip',
    [
        'antie/widgets/container'
    ],
    function (Container) {
        "use strict";
        /**
         * The Carousel widget extends the container widget to manage a carousel of any orientation
         * @name antie.widgets.Carousel
         * @class
         * @extends antie.widgets.Container

         */
        var WidgetStrip = Container.extend(/** @lends antie.widgets.Container.prototype */ {
            init: function (id, orientation) {
                this._super(id);
                this.addClass(orientation.styleClass());
                this._orientation = orientation;
                this.addClass('carouselwidgetstrip');
            },
            append: function (widget) {
                return this.appendChildWidget(widget);
            },

            insert: function (index, widget) {
                return this.insertChildWidget(index, widget);
            },

            remove: function (widget, retainElement) {
                return this.removeChildWidget(widget, retainElement);
            },

            removeAll: function () {
                return this.removeChildWidgets();
            },

            widgets: function () {
                return this.getChildWidgets();
            },

            getLengthToIndex: function (index) {
                var i, widgets, currentWidget, lengthToIndexedWidget, endIndex;
                endIndex = index;
                widgets = this.getChildWidgets();
                lengthToIndexedWidget = 0;
                if (endIndex < 0) {
                    endIndex = 0;
                }
                if (endIndex > widgets.length) {
                    endIndex = widgets.length;
                }

                for (i = 0; i !== endIndex; i += 1) {
                    currentWidget = widgets[i];
                    lengthToIndexedWidget += this._getWidgetLength(currentWidget);
                }
                return lengthToIndexedWidget;
            },

            _getWidgetLength: function (widget) {
                return this._getElementLength(widget.outputElement);
            },

            _getElementLength: function (element) {
                var device;
                device = this._getDevice();
                return device.getElementSize(element)[this._getDimension()];
            },

            _getDevice: function () {
                return this.getCurrentApplication().getDevice();
            },

            _getDimension: function () {
                return this._orientation.dimension();
            }
        });

        return WidgetStrip;
    }
);