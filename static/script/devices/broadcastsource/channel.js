/**
 * @fileOverview Requirejs module containing the antie.devices.broadcastsource.channel class.
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

require.def('antie/devices/broadcastsource/channel',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';

        /**
         * Class representing information about a channel.
         * @class
         * @name antie.devices.broadcastsource.Channel
         * @extends antie.Class
         * @param props.name Channel name (as appears in the broadcast stream / EPG)
         * @param [props.onid] Original Network ID
         * @param [props.tsid] Transport Stream ID
         * @param [props.sid] Service ID (program number)
         */
        return Class.extend(/** @lends antie.devices.broadcastsource.Channel.prototype */{
            /**
             * @constructor
             * @ignore
             */
            init : function(props) {
                this.name = props.name;
                this.onid = props.onid || undefined;
                this.tsid = props.tsid || undefined;
                this.sid = props.sid || undefined;
                // Device specific:
                this.idType = props.idType;
                this.ptc = props.ptc || undefined;
                this.major = props.major || undefined;
                this.minor = props.minor || undefined;
                this.sourceId = props.sourceId || undefined;
            }

        });
    }
);
