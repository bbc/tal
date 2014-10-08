/**
 * @fileOverview Requirejs module containing the antie.events.TunerUnavailableEvent class.
 *
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
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

require.def('antie/events/tunerunavailableevent',
    ['antie/events/event'],
    function (Event) {
        'use strict';

        /**
         * Indicates broadcast has been interrupted, for example because the broadcast signal has stopped. (e.g. the
         * antenna has been removed from the device.)
         * @class
         * @name antie.events.TunerUnavailableEvent
         * @extends antie.events.Event
         */
        return Event.extend(/** @lends antie.events.Event.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function () {
                this._super("tunerunavailable");
            }
        });
    }
);