/**
 * @fileOverview Requirejs module containing a helper to track seek state for
 * CEHTML media modifier.
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

require.def('antie/devices/media/seekstate',
    [
        'antie/class',
        'antie/events/mediaevent'
    ],

    function(Class, MediaEvent){
        'use strict';

        var State = {
                        None        : 0,
                        Seeking     : 1,
                        Playing     : 2
                    };

    var SeekState = Class.extend({

        init :function(eventHandlingCallback) {
            this._eventHandlingCallback = eventHandlingCallback;
            this._currentTime = 0;
            this._state = State.None;
        },

        seekTo: function(time) {
            if (time === this._currentTime) {
                return;
            }

            this._state = State.Seeking;
            this._currentTime = time;

            this._eventHandlingCallback(new MediaEvent("seeking"));
        },

        playing: function() {
            if (this._state === State.Seeking) {
                this._eventHandlingCallback(new MediaEvent("seeked"));
            }

            this._state = State.Playing;
        }

    });

    return SeekState;

}
);