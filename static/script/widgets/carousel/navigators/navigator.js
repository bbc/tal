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
require.def('antie/widgets/carousel/navigators/navigator',
    [
        'antie/class',
        'antie/events/selecteditemchangeevent',
        'antie/events/beforeselecteditemchangeevent'
    ],

    /**
     * Abstract base Navigator class, used for operations involving widget indices,
     * for example setting the active widget or determining which to set active.
     * @abstract
     * @name antie.widgets.carousel.navigators.Navigator
     * @abstract
     * @class
     * @extends antie.Class
     */
    function (Class, SelectedItemChangeEvent, BeforeSelectedItemChangeEvent) {
        "use strict";
        var Navigator;

        Navigator = Class.extend(/** @lends antie.widgets.carousel.navigators.Navigator.prototype */{
            /**
             * @constructor
             * @ignore
             */
            init: function (container) {
                this.setContainer(container);
            },

            /**
             * @returns {Number} the index of the currently active widget, or null if there is no active widget
             * (for example if there are no widgets)
             */
            currentIndex: function () {
                return (this._getActiveIndex());
            },

            /**
             * @returns {Number} the index of the next focusable widget
             */
            nextIndex: function () {
                var currentIndex = this.currentIndex();
                return this.indexAfter(currentIndex);
            },

            /**
             * @param index
             * @returns {Number} the first focussable index after that supplied
             */
            indexAfter: function (index) {
                return this._getNextPotientialIndexInDirection(index, Navigator.directions.FORWARD);
            },

            /**
             * @returns {Number} the index of the previous focusable widget
             */
            previousIndex: function () {
                var currentIndex = this.currentIndex();
                return this.indexBefore(currentIndex);
            },

            /**
             * @param index
             * @returns {Number} the first focussable index before that supplied
             */
            indexBefore: function (index) {
                return this._getNextPotientialIndexInDirection(index, Navigator.directions.BACKWARD);
            },

            /**
             * @returns {Number} the number of widgets in the container under control
             */
            indexCount: function () {
                return this._container.getChildWidgetCount();
            },

            /**
             * Activates the widget at the provided index within the container under control.
             * If a valid (0 <= index < length of container) index, corresponding to a focusable widget is provided and the index
             * is not the currently active index, the widget indexed is activated.
             * If the index corresponds to an unfocussable widget or an invalid index the function has no effect.
             * @param {Number} index A 0 base index into the container being navigated
             */
            setIndex: function (index) {
                if (this._isValidIndex(index) && !this._indexedWidgetCantBeFocussed(index)) {
                    this._fireItemChangeEvent(index, BeforeSelectedItemChangeEvent);
                    this._setActiveIndexOnContainer(index);
                    this._fireItemChangeEvent(index, SelectedItemChangeEvent);
                }
            },

            /**
             * Sets the container the navigator is managing
             */
            setContainer: function (container) {
                this._container = container;
            },

            _getActiveIndex: function () {
                var activeWidget, activeIndex;
                activeWidget = this._container.getActiveChildWidget();
                activeIndex = this._container.getIndexOfChildWidget(activeWidget);
                if (activeIndex !== -1) {
                    return activeIndex;
                } else {
                    return null;
                }
            },

            _setActiveIndexOnContainer: function (activeIndex) {
                if (activeIndex !== this.currentIndex()) {
                    this._container.setActiveChildIndex(activeIndex);
                }
            },

            _indexedWidgetCantBeFocussed: function (index) {
                var widgets, focussable;
                widgets = this._container.getChildWidgets();
                focussable = widgets[index].isFocusable();
                return !focussable;
            },

            _getIndexIncrementFunction: function (direction) {
                var nextFn;
                function forwardFn(index) { return index + 1; }
                function backFn(index) { return index - 1; }

                switch (direction) {
                case Navigator.directions.FORWARD:
                    nextFn = forwardFn;
                    break;
                case Navigator.directions.BACKWARD:
                    nextFn = backFn;
                    break;
                }
                return nextFn;
            },

            _getNextPotientialIndexInDirection: function (currentIndex, direction) {
                var potentialActiveIndex, indexIsValid, incrementIndex;
                incrementIndex = this._getIndexIncrementFunction(direction);

                potentialActiveIndex = incrementIndex(currentIndex);
                indexIsValid = this._isValidIndex(potentialActiveIndex);

                while (indexIsValid && this._indexedWidgetCantBeFocussed(potentialActiveIndex)) {
                    potentialActiveIndex = incrementIndex(potentialActiveIndex);
                    indexIsValid = this._isValidIndex(potentialActiveIndex);
                }

                return potentialActiveIndex;
            },

            _fireItemChangeEvent: function (index, EventClass) {
                var event, item, target;
                target = this._container;
                item = this._container.getChildWidgets()[index];
                event = new EventClass(target, item, index);
                target.bubbleEvent(event);
            }
        });

        Navigator.directions = {
            FORWARD: 0,
            BACKWARD: 1
        };

        return Navigator;
    }
);