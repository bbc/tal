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
require.def('antie/widgets/carousel/strips/utility/widgetcontext',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';
        var WidgetContext;
        WidgetContext = Class.extend({
            init: function (widget, parent, STATES) {
                this._widget = widget;
                this._parent = parent;
                this.STATES = STATES;
                this._state = new this.STATES.INIT(this);
            },

            /**
             * Appends output element to parent if not already child
             */
            append: function () {
                this._state.append(this, this._parent, this._widget);
            },

            /**
             * Prepends output element to parent if not already child
             */
            prepend: function () {
                this._state.prepend(this, this._parent, this._widget);
            },

            /**
             * Element no longer needs to be visible (e.g. remove from DOM)
             */
            detach: function () {
                this._state.detach(this, this._widget);
            },

            /**
             * @returns {Boolean} true if widget currently takes up space in its parent, false otherwise
             * e.g. would return true if rendered, in the document and without display: none set
             * would return false if not rendered, not in the DOM or with display: none set
             */
            hasLength: function () {
                return this._state.hasLength();
            },

            inView: function () {
                return this._state.inView();
            },

            setState: function (stateName) {
                this._state = new this.STATES[stateName](this);
            }
        });

        return WidgetContext;
    }
);