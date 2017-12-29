/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/devices/parentalguidance/basepghandler',
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
            isChallengeActive: function isChallengeActive () {
                throw new Error('IsChallengeActive method has not been implemented.');
            },
            /**
             * Show UI for pin challenge
             * @param {string} optional message to display when showing challenge.
             * @param {Object} callback object containing onGuidanceChallengeResponse(response) function
             *                   where response is defined by object in pgchallengeresponse
             */
            showChallenge: function showChallenge () {
                throw new Error('ShowChallenge method has not been implemented.');
            },
            /**
             * Determines whether handler can display PG message as part of its PIN challenge
             * @returns {boolean}
             */
            supportsMessage: function supportsMessage () {
                throw new Error('SupportsMessage method has not been implemented.');
            },
            /**
             * Determines whether handler can handle display of PG settings screen.
             * @returns {boolean}
             */
            isConfigurable: function isConfigurable () {
                throw new Error('IsConfigurable method has not been implemented.');
            }
        });

        return BasePgHandler;
    }
);
