/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.navigators.wrappingnavigator class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/navigators/wrappingnavigator',
    [
        'antie/widgets/carousel/navigators/navigator'
    ],
    /**
     * Wrapping Navigator class, used for operations involving widget indices,
     * where they should be viewed as a circular list.
     * @name antie.widgets.carousel.navigators.WrappingNavigator
     * @abstract
     * @class
     * @extends antie.widgets.carousel.navigators.Navigator
     */
    function (Navigator) {
        'use strict';
        return Navigator.extend( /** @lends antie.widgets.carousel.navigators.WrappingNavigator.prototype */
            {
                /**
                 * @param index
                 * @returns {Number} the first focussable index after that supplied
                 */
                indexAfter: function indexAfter (index) {
                    var potentialIndex;
                    potentialIndex = indexAfter.base.call(this, index);
                    return this._validateIndex(index, potentialIndex);
                },

                /**
                 * @param index
                 * @returns {Number} the first focussable index before that supplied
                 */
                indexBefore: function indexBefore (index) {
                    var potentialIndex;
                    potentialIndex = indexBefore.base.call(this, index);
                    return this._validateIndex(index, potentialIndex);
                },

                _validateIndex: function _validateIndex (currentIndex, potentialIndex) {
                    var index;
                    index = null;
                    potentialIndex = this._wrapIndex(potentialIndex);
                    if (potentialIndex !== currentIndex) {
                        index = potentialIndex;
                    }
                    return index;
                },

                _isValidIndex: function _isValidIndex (index) {
                    var stripLength;
                    stripLength = this._container.getChildWidgetCount();
                    return (typeof index === 'number' && (index < stripLength) && index >= 0);
                },

                _wrapIndex: function _wrapIndex (potentialIndex) {
                    var index, stripLength;
                    function indexIsFirstOffTheFront() {
                        return (potentialIndex === -1);
                    }
                    function indexIsFirstOffTheEnd() {
                        return (potentialIndex === stripLength);
                    }

                    stripLength = this._container.getChildWidgetCount();
                    index = potentialIndex;
                    if (indexIsFirstOffTheFront()) {
                        index = this._getNextPotientialIndexInDirection(stripLength, Navigator.directions.BACKWARD);
                    } else if (indexIsFirstOffTheEnd()) {
                        index = this._getNextPotientialIndexInDirection(-1, Navigator.directions.FORWARD);
                    }

                    return index;
                }

            }
        );
    }
);
