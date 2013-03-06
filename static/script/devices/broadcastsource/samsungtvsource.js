/**
 * @fileOverview Requirejs module containing the antie.devices.broadcastsource.samsungtvsource class.
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

require.def('antie/devices/broadcastsource/samsungtvsource',
    [
        'antie/devices/browserdevice',
        'antie/devices/broadcastsource/basetvsource',
        'antie/application'
    ],
    function (Device, BaseTvSource, Application) {
        /**
         * Contains a Samsung Maple implementation of the antie broadcast TV source.
         * @see http://www.samsungdforum.com/Guide/ref00014/PL_WINDOW_SOURCE.html
         */
        var PL_WINDOW_SOURCE_TV = 0; // The TV source
        var PL_WINDOW_SOURCE_MEDIA = 43; // The media source

        var DOM_ELEMENT_ID = "pluginObjectWindow";
        var SamsungSource = BaseTvSource.extend(/** @lends antie.devices.broadcastsource.SamsungSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function () {
                this._samsungSefWindowPlugin = document.getElementById(DOM_ELEMENT_ID);

                if (!this._samsungSefWindowPlugin) {
                    throw new Error('Unable to initialise Samsung broadcast source');
                }

                this._setBroadcastToFullScreen();
            },
            /**
             * Sets the current source to TV broadcast
             * @see http://www.samsungdforum.com/Guide/ref00014/SetSource.html
             */
            showCurrentChannel: function () {
                this._samsungSefWindowPlugin.SetSource(PL_WINDOW_SOURCE_TV);
            },
            /**
             * Sets the current source to the media source
             * @see http://www.samsungdforum.com/Guide/ref00014/SetSource.html
             */
            stopCurrentChannel: function() {
                this._samsungSefWindowPlugin.SetSource(PL_WINDOW_SOURCE_MEDIA);
            },
            /**
             * Gets the service name of the current channel
             * @see http://www.samsungdforum.com/Guide/ref00014/getcurrentchannel_servicename.html
             */
            getCurrentChannelName: function () {
                var channelName = this._samsungSefWindowPlugin.GetCurrentChannel_Name();
                if (channelName < 0) {
                    throw new Error('Channel name returned error code: ' + channelName);
                }
                return channelName;
            },
            /**
             * Sets the size and position of the visible broadcast source
             * @param top
             * @param left
             * @param width
             * @param height
             */
            setPosition : function(top, left, width, height) {
                this._samsungSefWindowPlugin.SetScreenRect(left, top, width, height);
            },
            /**
             * Reverts the current screen settings and performs any clean up required before
             * the user exits the application back to standard broadcast.
             * @see http://www.samsungdforum.com/Guide/tec00103/index.html
             */
            destroy : function() {
                this.setPosition(0, -1, 0, 0);
            },
            _setBroadcastToFullScreen : function() {
                var currentLayout = Application.getCurrentApplication().getLayout().requiredScreenSize;
                this.setPosition(0, 0, currentLayout.width, currentLayout.height);
            }
        });

        /**
         * Create a new widget giving control over broadcast television. Check whether
         * the broadcast television API is available first with isBroadcastSourceSupported().
         * @see antie.widgets.broadcastsource
         * @returns {Object} Device-specific implementation of antie.widgets.broadcastsource
         */
        Device.prototype.createBroadcastSource = function() {
            return new SamsungSource();
        };
    }
);