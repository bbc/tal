/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.existingtransitiondefinition class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/anim/css3/existingtransitiondefinition',
    [
        'antie/devices/anim/css3/transitiondefinition'
    ],
    function(TransitionDefinition) {
        'use strict';
        return TransitionDefinition.extend(
            {
                init: function init (transitionElement) {
                    var properties, durations, delays, timingFns, i;
                    init.base.call(this);
                    properties = transitionElement.getProperties();
                    durations = transitionElement.getDurations();
                    delays = transitionElement.getDelays();
                    timingFns = transitionElement.getTimingFns();

                    for(i = 0; i !== properties.length; i += 1) {
                        this.setProperty(
                            properties[i],
                            {
                                duration: durations[i],
                                timingFn: timingFns[i],
                                delay: delays[i]
                            }
                        );
                    }
                }
            }
        );
    }
);
