/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.existingtransitiondefinition class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/anim/css3/optionstransitiondefinition',
    [
        'antie/devices/anim/css3/transitiondefinition'
    ],
    function(TransitionDefinition) {
        'use strict';
        return TransitionDefinition.extend(
            {
                /*
                 * Transition definition from options.
                 * @param animation options object
                 * @param config animation configuration object
                 */
                init: function init (options, config) {
                    var property, timeEasing;
                    config = config || {};
                    init.base.call(this);
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
