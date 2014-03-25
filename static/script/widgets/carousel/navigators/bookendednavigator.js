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

require.def('antie/widgets/carousel/navigators/bookendednavigator',
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
		"use strict";
        var BookendedNavigator;
        BookendedNavigator = Navigator.extend(/** @lends antie.widgets.carousel.navigators.BookendedNavigator.prototype */ {

                /**
                 * @param index
                 * @returns {Number} the first focussable index after that supplied
                 */
                indexAfter: function (index) {
                    var potentialIndex;
                    potentialIndex = this._super(index);
                    return this._validateIndex(potentialIndex);
                },

                /**
                 * @param index
                 * @returns {Number} the first focussable index before that supplied
                 */
                indexBefore: function (index) {
                    var potentialIndex;
                    potentialIndex = this._super(index);
                    return this._validateIndex(potentialIndex);
                },

                _isValidIndex: function (index) {
                    var stripLength;
                    stripLength = this._container.getChildWidgetCount();
                    return (typeof index === 'number' && (index < stripLength) && index >= 0);
                },

                _validateIndex: function (potentialIndex) {
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