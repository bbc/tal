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
require.def('antie/widgets/carousel/binders/batchbinder',
    [
        'antie/widgets/carousel/binder'
    ],
    function (Binder) {
        "use strict";
        /**
         * Allows binding in batches with calculation disabled until after final bind
         * @name antie.widgets.carousel.binders.BatchBinder
         * @class
         * @extends antie.widgets.carousel.Binder
         */
        return Binder.extend(/** @lends antie.widgets.carousel.BatchBinder.prototype */ {
            /**
             * Creates new widgets which are then appended to
             * the widget supplied. Continues until the end of the data returned
             * by the source is reached.
             * @param widget The parent of the widgets to be created.
             */
            appendAllTo: function (widget) {
                this._bindAll(
                    widget,
                    this._appendItem,
                    this._disableAutoCalc,
                    this._enableAutoCalc
                );
            },

            _disableAutoCalc: function (ev) {
                ev.target.autoCalculate(false);
            },

            _enableAutoCalc: function (ev) {
                ev.target.autoCalculate(true);
                ev.target.recalculate();
            }
        });
    }
);