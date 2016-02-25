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
define(
    'antie/widgets/carousel/strips/utility/state',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';
        var State;
        State = Class.extend({
            init: function () {
                // implement in child
            },

            append: function (/*context, parent, widget*/) { //jshint ignore:line
                // implement in child
            },

            prepend: function (/*context, parent, widget*/) { //jshint ignore:line
                // implement in child
            },

            detach: function (/*context, widget*/) { //jshint ignore:line
                // implement in child
            },

            hasLength: function () {
                // implement in child
            },

            inView: function () {
                // implement in child
            }
        });
        return State;
    }
);
