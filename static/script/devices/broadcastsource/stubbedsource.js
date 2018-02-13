/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/devices/broadcastsource/stubbedsource',
    [
        'antie/devices/browserdevice',
        'antie/devices/broadcastsource/basetvsource'
    ],
    function (Device, BaseTvSource) {
        'use strict';

        /**
         * Contains a stubbed implementation of the antie broadcast TV source.
         * @class
         * @name antie.devices.broadcastsource.StubbedSource
         * @extends antie.devices.broadcastsource.BaseTVSource
         */

        var StubbedSource = BaseTvSource.extend(/** @lends antie.devices.broadcastsource.StubbedSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init () {},
            showCurrentChannel: function showCurrentChannel () {},
            stopCurrentChannel: function stopCurrentChannel () {},
            getCurrentChannelName: function getCurrentChannelName () {
                return 'BBC ONE N West';
            },
            getChannelNameList : function () {
                return [
                    { 'name' : 'Catal Test' },
                    { 'name' : 'BBC ONE N West' },
                    { 'name' : 'BBC TWO' },
                    { 'name' : 'INVALID'}
                ];
            },

            setChannelByName : function() {},
            setPosition : function() {},
            getState : function() {
                return BaseTvSource.STATE.PRESENTING;
            },
            destroy : function() {}
        });

        Device.prototype.isBroadcastSourceSupported = function() {
            return true;
        };

        /**
         * Create a broadcastSource object on the Device to be
         * accessed as a singleton to avoid the init being run
         * multiple times
         */
        Device.prototype.createBroadcastSource = function() {
            if(!this._broadcastSource) {
                this._broadcastSource = new StubbedSource();
            }

            return this._broadcastSource;
        };

        // Return the StubbedSource object for testing purposes
        return StubbedSource;
    }
);
