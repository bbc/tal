/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.navigators.bookendednavigator class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/navigators/bookendednavigator',
    [
        'antie/widgets/carousel/navigators/navigator'
    ],
    /**
     * Bookended Navigator class, used for operations involving widget indices,
     * where they should be viewed as a bookended list.
     * @name antie.widgets.carousel.navigators.BookendedNavigator
     * @abstract
     * @class
     * @extends antie.widgets.carousel.navigators.Navigator
     */
    function (Navigator) {
        'use strict';
        var BookendedNavigator;
        BookendedNavigator = Navigator.extend(/** @lends antie.widgets.carousel.navigators.BookendedNavigator.prototype */ {

            /**
             * @param index
             * @returns {Number} the first focussable index after that supplied
             */
            indexAfter: function indexAfter (index) {
                var potentialIndex;
                potentialIndex = indexAfter.base.call(this, index);
                return this._validateIndex(potentialIndex);
            },

            /**
             * @param index
             * @returns {Number} the first focussable index before that supplied
             */
            indexBefore: function indexBefore (index) {
                var potentialIndex;
                potentialIndex = indexBefore.base.call(this, index);
                return this._validateIndex(potentialIndex);
            },

            _isValidIndex: function _isValidIndex (index) {
                var stripLength;
                stripLength = this._container.getChildWidgetCount();
                return (typeof index === 'number' && (index < stripLength) && index >= 0);
            },

            _validateIndex: function _validateIndex (potentialIndex) {
                var index;
                index = null;
                if (this._isValidIndex(potentialIndex)) {
                    index = potentialIndex;
                }
                return index;
            }

        }
        );

        return BookendedNavigator;
    }
);
