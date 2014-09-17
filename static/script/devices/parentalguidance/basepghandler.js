/**
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
require.def('antie/devices/parentalguidance/basepghandler',
    [
        'antie/class'
    ],
    function(Class) {
        'use strict';

        var BasePgHandler = Class.extend({

            /**
             * Has the user already setup a PIN/Password for PG?
             * @returns {boolean}
             */
            isChallengeActive: function() {
                throw new Error("IsChallengeActive method has not been implemented.");
            },
            /**
             * Show UI for pin challenge
             * @param {string} optional message to display when showing challenge.
             * @param {Object} callback object containing onGuidanceChallengeResponse(response) function
             *                   where response is defined by object in pgchallengeresponse
             */
            showChallenge: function() {
                throw new Error("ShowChallenge method has not been implemented.");
            },
            /**
             * Determines whether handler can display PG message as part of its PIN challenge
             * @returns {boolean}
             */
            supportsMessage: function() {
                throw new Error("SupportsMessage method has not been implemented.");
            },
            /**
             * Determines whether handler can handle display of PG settings screen.
             * @returns {boolean}
             */
            isConfigurable: function() {
                throw new Error("IsConfigurable method has not been implemented.");
            }
        });

        return BasePgHandler;
    }
);