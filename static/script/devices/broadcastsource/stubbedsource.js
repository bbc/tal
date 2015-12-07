/**
 * @fileOverview Requirejs module containing the antie.widgets.hbbtvsource class.
 *
 * @preserve Copyright (c) 2013-2014 British Broadcasting Corporation
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

require.def('antie/devices/broadcastsource/stubbedsource',
    [
        'antie/devices/browserdevice',
        'antie/devices/broadcastsource/basetvsource',
        'antie/runtimecontext',
        'antie/events/tunerunavailableevent',
        'antie/events/tunerpresentingevent',
        'antie/events/tunerstoppedevent'
    ],
    function (Device, BaseTvSource) {
        'use strict';

        /**
         * Contains a HBBTV implementation of the antie broadcast TV source.
         * @class
         * @name antie.devices.broadcastsource.HbbTVSource
         * @extends antie.devices.broadcastsource.BaseTVSource
         */

        var StubbedSource = BaseTvSource.extend(/** @lends antie.devices.broadcastsource.HbbTVSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function () {},
            showCurrentChannel: function () {},
            stopCurrentChannel: function () {},
            getCurrentChannelName: function () {
                return "BBC ONE N West";
            },
            getChannelNameList : function () {
                return [
                    { "name" : "Catal Test" },
                    { "name" : "BBC ONE N West" },
                    { "name" : "BBC TWO" },
                    { "name" : "INVALID"}
                ];
            },

            setChannelByName : function() {},
            setPosition : function() {},
            getState : function() {
                return BaseTvSource.STATE.PRESENTING
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
                this._broadcastSource= new StubbedSource();
            }

            return this._broadcastSource;
        };

        // Return the StubbedSource object for testing purposes
        return StubbedSource;
    }
);
