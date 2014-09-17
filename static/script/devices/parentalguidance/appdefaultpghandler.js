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
require.def('antie/devices/parentalguidance/appdefaultpghandler',
    [
        'antie/devices/browserdevice',
        'antie/devices/parentalguidance/basepghandler'
    ],
    function (Device, BasePgHandler) {
        'use strict';

        var appDefaultPgHandler = BasePgHandler.extend({

            isChallengeActive: function() {
                if (this._appHandler) {
                    return this._appHandler.isChallengeActive();
                } else {
                    throw new Error('No default parental guidance handler is registered');
                }
            },
            showChallenge: function(message, guidanceChallengeResponseCallBack) {
                if (!this._appHandler) {
                    throw new Error('No default parental guidance handler is registered');
                } else if (typeof(guidanceChallengeResponseCallBack.onGuidanceChallengeResponse) != "function") {
                    throw new Error('The guidanceChallengeResponseCallback object should contain an onGuidanceChallengeResponse' +
                        'function. The appHandler should call this function with a value from pgchallengeresponse.js as the first parameter');
                } else {
                   return this._appHandler.showChallenge(message, guidanceChallengeResponseCallBack);
                }
            },
            supportsMessage: function() {
              return true;
            },
            isConfigurable: function() {
                return true;
            }
        });

        Device.prototype.parentalGuidanceHelper = new appDefaultPgHandler;

        /**
         *
         * @param {object} containing implementation of showChallenge() and isChallengeActive()
         */
        Device.prototype.registerAppPgHandler = function(appHandler) {
            this.parentalGuidanceHelper._appHandler = appHandler;
        };

    }
);