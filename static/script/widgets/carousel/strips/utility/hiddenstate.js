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
require.def('antie/widgets/carousel/strips/utility/hiddenstate',
    [
        'antie/widgets/carousel/strips/utility/state'
    ],
    function (State) {
        'use strict';
        var RenderedState;
        RenderedState = State.extend({
            init: function () {

            },

            append: function (context, parent, widget) {
                this._show(context, widget);
            },

            prepend: function (context, parent, widget) {
                this._show(context, widget);
            },

            detach: function (context, widget) {

            },

            hasLength: function () {
                return true;
            },

            inView: function () {
                return false;
            },

            _getDevice: function (widget) {
                return widget.getCurrentApplication().getDevice();
            },

            _show: function (context, widget) {
                widget.getCurrentApplication().getDevice().showElement({el: widget.outputElement, skipAnim: true});
                context.setState('ATTACHED');
            }
        });
        return RenderedState;
    }
);