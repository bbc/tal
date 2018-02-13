/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/parentalguidance/appdefaultpghandler',
    [
        'antie/devices/browserdevice',
        'antie/devices/parentalguidance/basepghandler'
    ],
    function (Device, BasePgHandler) {
        'use strict';

        var appDefaultPgHandler = BasePgHandler.extend({

            isChallengeActive: function isChallengeActive () {
                if (this._appHandler) {
                    return this._appHandler.isChallengeActive();
                } else {
                    throw new Error('No default parental guidance handler is registered');
                }
            },
            showChallenge: function showChallenge (message, guidanceChallengeResponseCallBack) {
                if (!this._appHandler) {
                    throw new Error('No default parental guidance handler is registered');
                } else if (typeof(guidanceChallengeResponseCallBack.onGuidanceChallengeResponse) !== 'function') {
                    throw new Error('The guidanceChallengeResponseCallback object should contain an onGuidanceChallengeResponse' +
                                    'function. The appHandler should call this function with a value from pgchallengeresponse.js as the first parameter');
                } else {
                    return this._appHandler.showChallenge(message, guidanceChallengeResponseCallBack);
                }
            },
            supportsMessage: function supportsMessage () {
                return true;
            },
            isConfigurable: function isConfigurable () {
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
