/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/parentalguidance/youviewpghandler',
    [
        'antie/devices/browserdevice',
        'antie/devices/parentalguidance/basepghandler',
        'antie/devices/parentalguidance/pgchallengeresponse'
    ],
    function (Device, BasePgHandler, PgChallengeResponse) {
        /* global youview: true */
        'use strict';

        var devicePinEnabled;

        youview.parentalControls.getParentalControlSettings().then(
            function (value) {
                devicePinEnabled = value.parentalControlsEnabled;
            }
        );

        var youViewPgHandler = BasePgHandler.extend({
            isChallengeActive: function () {
                return devicePinEnabled;
            },
            showChallenge: function (message, guidanceChallengeResponseCallBack) {

                var responseValues = youview.parentalControls.PinPromptResponseValue;
                var onGuidanceChallengeResponse = guidanceChallengeResponseCallBack.onGuidanceChallengeResponse;

                youview.parentalControls.showPinPrompt().then(
                    function (responseCode) {
                        switch (responseCode) {
                        case responseValues.CORRECT:
                            onGuidanceChallengeResponse(PgChallengeResponse.AUTHORISED);
                            break;
                        case responseValues.INCORRECT:
                        case responseValues.CANCELLED_BY_USER:
                            onGuidanceChallengeResponse(PgChallengeResponse.NOT_AUTHORISED);
                            break;
                        default:
                            onGuidanceChallengeResponse(PgChallengeResponse.ERROR);
                        }
                    },
                    function () {
                        onGuidanceChallengeResponse(PgChallengeResponse.ERROR);
                    }
                );
            },
            supportsMessage: function () {
                return false;
            },
            isConfigurable: function () {
                return false;
            }
        });

        Device.prototype.parentalGuidanceHelper = new youViewPgHandler;

        Device.prototype.registerAppPgHandler = function () {
        };
    }
);
