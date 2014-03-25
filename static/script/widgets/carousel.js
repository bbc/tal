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
    /**
     * Ordered list of widgets that can be navigated by moving the list or the selection point
     * Provides adapter layer to old widget methods
     * @name antie.widgets.Carousel
     * @class
     * @extends antie.widgets.carousel.CarouselCore
     * @param {string} id The id of the carousel, id_CarouselMask will be used as the id for the mask element
     * and id_WidgetStrip will be used as the id of the widget strip element
     * @param {Object} [orientation=antie.widgets.carousel.CarouselCore.orientations.VERTICAL] the orientation object of
     * the carousel. Vertical by default, for horizontal pass in antie.widgets.carousel.CarouselCore.orientations.HORIZONTAL
     */
    function (CarouselCore, Container) {
        "use strict";
        var Carousel = CarouselCore.extend(/** @lends antie.widgets.Carousel.prototype */ {
            /**
             * Appends a child widget to this widget.
             * @param {antie.widgets.Widget} widget The child widget to add.
             */
            appendChildWidget: function (widget) {
                return this.append(widget);
            },

            /**
             * Inserts a child widget at the specified index.
             * @param {Integer} index The index where to insert the child widget.
             * @param {antie.widgets.Widget} widget The child widget to add.
             */
            insertChildWidget: function (index, widget) {
                return this.insert(index, widget);
            },

            /**
             * Removes a specific child widget from this widget.
             * @param {antie.widgets.Widget} widget The child widget to remove.
             * @param {Boolean} [retainElement] Pass <code>true</code> to retain the child output element of the given widget
             */
            removeChildWidget: function (widget, retainElement) {
                return this.remove(widget, retainElement);
            },

            /**
             * Remove all child widgets from this widget.
             */
            removeChildWidgets: function () {
                return this.removeAll();
            },

            /**
             * Attempt to set focus to the given child widget.
             *
             * Note: You can only set focus to a focusable widget. A focusable widget is one that
             * contains an enabled antie.widgets.Button as either a direct or indirect child.
             *
             * Note: Widgets have 2 independent states: active and focussed. A focussed widget is
             * either the Button with focus, or any parent of that Button. An active widget is
             * one which is the active child of its parent Container. When the parent widget
             * receives focus, focus will be placed on the active child.
             *
             * Classes 'active' and 'focus' are appended to widgets with these states.
             *
             * @param {antie.widgets.Widget} widget The child widget to set focus to.
             * @returns Boolean true if the child widget was focusable, otherwise boolean false.
             */
            setActiveChildWidget: function (widget) {
                if (widget === this._mask) {
                    return this._super(widget);
                } else {
                    return this.setActiveWidget(widget);
                }
            },

            /**
             * Checks to see if a specific widget is a direct child of this widget.
             * @param {antie.widgets.Widget} widget The widget to check to see if it is a direct child of this widget.
             */
            hasChildWidget: function (id) {
                if (id === this._mask.id) {
                    return this._super(id);
                } else {
                    return this._widgetStrip.hasChildWidget(id);
                }
            },

            /**
             * Get the current active widget.
             * @returns The current active widget
             */
            getActiveChildWidget: function () {
                return this._widgetStrip.getActiveChildWidget();
            },

            /**
             * Get a child widget from its unique ID.
             * @param {String} id The id of the child widget to return.
             * @returns antie.widgets.Widget of the widget with the given ID, otherwise undefined if the child does not exist.
             */
            getChildWidget: function (id) {
                if (id === this._mask.id) {
                    return this._mask;
                } else {
                    return this._widgetStrip.getChildWidget(id);
                }
            },

            /**
             * Gets the number of direct child widgets.
             * @returns The number of direct child widgets.
             */
            getChildWidgetCount: function () {
                return this._widgetStrip.getChildWidgetCount();
            },

            /**
             * Get an array of all this widget's children.
             * @returns An array of all this widget's children.
             */
            getChildWidgets: function () {
                return this.items();
            },

            /**
             * Attempts to set focus to the child widget at the given index.
             * @see #setActiveChildWidget
             * @param {Integer} index Index of the child widget to set focus to.
             * @returns Boolean true if the child widget was focusable, otherwise boolean false.
             */
            setActiveChildIndex: function (index) {
                return this.setActiveIndex(index);
            },

            /**
             * @see #setActiveChildWidget
             * @returns {Integer} index Index of the child widget that is currently active.
             */
            getActiveChildIndex: function () {
                return this.getActiveIndex();
            },

            /**
             * Adds a CSS class to the widget strip if not already present.
             * @param {String} className The class name to add.
             */
            addClass: function (className) {
                if (this._widgetStrip) {
                    return this._widgetStrip.addClass(className);
                }
            },

            /**
             * Checks to see if the widget strip has a given CSS class.
             * @param {String} className The class name to check.
             * @returns Boolean true if the device has the className. Otherwise boolean false.
             */
            hasClass: function (className) {
                if (this._widgetStrip) {
                    return this._widgetStrip.hasClass(className);
                } else {
                    return false;
                }
            },

            /**
             * Removes a CSS class from the widget strip if present.
             * @param {String} className The class name to remove.
             */
            removeClass: function (className) {
                if (this._widgetStrip) {
                    return this._widgetStrip.removeClass(className);
                }
            },

            /**
             * Get an array of class names that this widget strip has.
             * @returns An array of class names (Strings)
             */
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