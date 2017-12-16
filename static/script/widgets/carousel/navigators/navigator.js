/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.navigators.navigator class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/navigators/navigator',
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
        'use strict';
        var Navigator;

        Navigator = Class.extend(/** @lends antie.widgets.carousel.navigators.Navigator.prototype */{
            /**
             * @constructor
             * @ignore
             */
            init: function init (container) {
                this.setContainer(container);
            },

            /**
             * @returns {Number} the index of the currently active widget, or null if there is no active widget
             * (for example if there are no widgets)
             */
            currentIndex: function currentIndex () {
                return (this._getActiveIndex());
            },

            /**
             * @returns {Number} the index of the next focusable widget
             */
            nextIndex: function nextIndex () {
                var currentIndex = this.currentIndex();
                return this.indexAfter(currentIndex);
            },

            /**
             * @param index
             * @returns {Number} the first focussable index after that supplied
             */
            indexAfter: function indexAfter (index) {
                return this._getNextPotientialIndexInDirection(index, Navigator.directions.FORWARD);
            },

            /**
             * @returns {Number} the index of the previous focusable widget
             */
            previousIndex: function previousIndex () {
                var currentIndex = this.currentIndex();
                return this.indexBefore(currentIndex);
            },

            /**
             * @param index
             * @returns {Number} the first focussable index before that supplied
             */
            indexBefore: function indexBefore (index) {
                return this._getNextPotientialIndexInDirection(index, Navigator.directions.BACKWARD);
            },

            /**
             * @returns {Number} the number of widgets in the container under control
             */
            indexCount: function indexCount () {
                return this._container.getChildWidgetCount();
            },

            /**
             * Activates the widget at the provided index within the container under control.
             * If a valid (0 <= index < length of container) index, corresponding to a focusable widget is provided and the index
             * is not the currently active index, the widget indexed is activated.
             * If the index corresponds to an unfocussable widget or an invalid index the function has no effect.
             * @param {Number} index A 0 base index into the container being navigated
             */
            setIndex: function setIndex (index) {
                if (this._isValidIndex(index) && !this._indexedWidgetCantBeFocussed(index)) {
                    this._fireItemChangeEvent(index, BeforeSelectedItemChangeEvent);
                    this._setActiveIndexOnContainer(index);
                    this._fireItemChangeEvent(index, SelectedItemChangeEvent);
                }
            },

            /**
             * Sets the container the navigator is managing
             */
            setContainer: function setContainer (container) {
                this._container = container;
            },

            _getActiveIndex: function _getActiveIndex () {
                var activeWidget, activeIndex;
                activeWidget = this._container.getActiveChildWidget();
                activeIndex = this._container.getIndexOfChildWidget(activeWidget);
                if (activeIndex !== -1) {
                    return activeIndex;
                } else {
                    return null;
                }
            },

            _setActiveIndexOnContainer: function _setActiveIndexOnContainer (activeIndex) {
                if (activeIndex !== this.currentIndex()) {
                    this._container.setActiveChildIndex(activeIndex);
                }
            },

            _indexedWidgetCantBeFocussed: function _indexedWidgetCantBeFocussed (index) {
                var widgets, focussable;
                widgets = this._container.getChildWidgets();
                focussable = widgets[index].isFocusable();
                return !focussable;
            },

            _getIndexIncrementFunction: function _getIndexIncrementFunction (direction) {
                var nextFn;
                function forwardFn(index) {
                    return index + 1;
                }
                function backFn(index) {
                    return index - 1;
                }

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

            _getNextPotientialIndexInDirection: function _getNextPotientialIndexInDirection (currentIndex, direction) {
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

            _fireItemChangeEvent: function _fireItemChangeEvent (index, EventClass) {
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
