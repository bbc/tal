/**
 * @fileOverview Requirejs module containing the antie.events.SelectEvent class.
 *
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
require.def('antie/events/beforealignevent',
    ['antie/events/event'],
    function (Event) {
        "use strict";
        /**
         * Class of events raised when a Mask is about to change alignment of its widget strip.
         * @name antie.events.BeforeAlignEvent
         * @class
         * @extends antie.events.Event
         * @param {antie.widgets.carousel.Mask} target The mask that is about to align the strip
         * @param {Integer} to the index into the strip of the index alignment is moving to
         * @param {Integer} from the index into the strip of the index alignment is moving from
         */
        return Event.extend(/** @lends antie.events.BeforeSelectedItemChangeEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function (target, alignedIndex) {
                this.target = target;
                this.alignedIndex = alignedIndex;
                this._super("beforealign");
            }
        });
    }
);