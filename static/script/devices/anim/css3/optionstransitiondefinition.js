/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.optionstransitiondefinition class.
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


require.def(
    'antie/devices/anim/css3/optionstransitiondefinition',
    [
        'antie/devices/anim/css3/transitiondefinition'
    ],
    function(TransitionDefinition) {
        "use strict";
        return TransitionDefinition.extend(
            {
                /*
                 * Transition definition from options.
                 * @param animation options object
                 * @param config animation configuration object
                 */
                init: function(options, config) {
                    var property, timeEasing;
                    config = config || {};
                    this._super();
                    for(property in options.to) {
                        if(options.to.hasOwnProperty(property)) {
                            timeEasing = options.easing || config.easing;
                            this.setProperty(property, {
                               duration: options.duration || config.duration,
                               delay: options.delay,
                               timingFn: timeEasing ? TransitionDefinition.easingLookup[timeEasing] : undefined
                            });
                        }
                    }
                }
            }
        );
    }
);