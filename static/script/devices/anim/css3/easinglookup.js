/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.easinglookup class.
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
    'antie/devices/anim/css3/easinglookup',
    [
        'antie/class'
    ],
    /*
     * Translates Shifty style easing functions to CSS3 style timing functions
     */
    function (Class) {
        "use strict";

        return Class.extend(
            {
                init: function() {},
                // defaults
                'linear'            : 'linear',
                'ease'              : 'ease',
                'easeIn'            : 'ease-in',
                'easeOut'           : 'ease-out',
                'easeInOut'         : 'ease-in-out',
                // Penner equations
                'easeInCubic'       : 'cubic-bezier(.55,.055,.675,.19)',
                'easeOutCubic'      : 'cubic-bezier(.215,.61,.355,1)',
                'easeInOutCubic'    : 'cubic-bezier(.645,.045,.355,1)',
                'easeInCirc'        : 'cubic-bezier(.6,.04,.98,.335)',
                'easeOutCirc'       : 'cubic-bezier(.075,.82,.165,1)',
                'easeInOutCirc'     : 'cubic-bezier(.785,.135,.15,.86)',
                'easeInExpo'        : 'cubic-bezier(.95,.05,.795,.035)',
                'easeOutExpo'       : 'cubic-bezier(.19,1,.22,1)',
                'easeInOutExpo'     : 'cubic-bezier(1,0,0,1)',
                'easeInQuad'        : 'cubic-bezier(.55,.085,.68,.53)',
                'easeOutQuad'       : 'cubic-bezier(.25,.46,.45,.94)',
                'easeInOutQuad'     : 'cubic-bezier(.455,.03,.515,.955)',
                'easeInQuart'       : 'cubic-bezier(.895,.03,.685,.22)',
                'easeOutQuart'      : 'cubic-bezier(.165,.84,.44,1)',
                'easeInOutQuart'    : 'cubic-bezier(.77,0,.175,1)',
                'easeInQuint'       : 'cubic-bezier(.755,.05,.855,.06)',
                'easeOutQuint'      : 'cubic-bezier(.23,1,.32,1)',
                'easeInOutQuint'    : 'cubic-bezier(.86,0,.07,1)',
                'easeInSine'        : 'cubic-bezier(.47,0,.745,.715)',
                'easeOutSine'       : 'cubic-bezier(.39,.575,.565,1)',
                'easeInOutSine'     : 'cubic-bezier(.445,.05,.55,.95)',
                'easeInBack'        : 'cubic-bezier(.6,-.28,.735,.045)',
                'easeOutBack'       : 'cubic-bezier(.175,.885,.32,1.275)',
                'easeInOutBack'     : 'cubic-bezier(.68,-.55,.265,1.55)',
                // we use easeFromTo for some reason which is the same as easeInOutQuart
                'easeFromTo'    : 'cubic-bezier(.77,0,.175,1)'
            }
        );
    }
);
    