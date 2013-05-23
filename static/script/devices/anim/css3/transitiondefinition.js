/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.transitiondefinition class.
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
    'antie/devices/anim/css3/transitiondefinition',
    [
        'antie/class',
        'antie/devices/anim/css3/easinglookup'
    ],
    function(Class, EasingLookup) {
        "use strict";
        var TransitionDefinition;
        
        /*
         * Defines a class of transition in terms of its properties and their transition attributes.
         * It defines durations, delays and timing functions but not start and end points or callbacks 
         * (these are handled by TransitionEndPoints)
         */
        TransitionDefinition = Class.extend({
            init: function(){
                this.properties = {};
            },
            
            setProperty: function(property, attributes){
                if(attributes) {
                    this.properties[property] = {
                        duration: (attributes.duration !== undefined ? attributes.duration : TransitionDefinition.defaults.duration),
                        delay: (attributes.delay !== undefined ? attributes.delay : TransitionDefinition.defaults.delay),
                        timingFn: (attributes.timingFn !== undefined ? attributes.timingFn : TransitionDefinition.defaults.timingFn)
                    };
                } else {
                    this.properties[property] = {
                        duration: (TransitionDefinition.defaults.duration),
                        delay: (TransitionDefinition.defaults.delay),
                        timingFn: (TransitionDefinition.defaults.timingFn)
                    };
                }
            },
                        
            hasProperty: function(property) {
                return this.properties.hasOwnProperty(property);
            },
            
            getProperties: function() {
                var prop, propArr;
                propArr = [];
                for (prop in this.properties) {
                    if(this.hasProperty(prop)) {
                        propArr.push(prop);
                    }
                }
                return propArr;
            },
            
            removeProperty: function(property) {
                if(this.hasProperty(property)) {
                    delete this.properties[property];
                    return true;
                }
                return false;
            },
            
            getPropertyDuration: function(property) {
                return this._getPropertyAttribute(property, 'duration');
                
            },
            
            getPropertyDelay: function(property) {
                return this._getPropertyAttribute(property, 'delay');
            },
            
            getPropertyTimingFn: function(property) {
                return this._getPropertyAttribute(property, 'timingFn');
            },
            
            setPropertyDuration: function(property, duration) {
                if (this.hasProperty(property)) {
                    this.properties[property].duration = duration;
                } else {
                    this.setProperty(property, {
                        duration: duration
                    });
                }
            },
            
            setPropertyDelay: function(property, delay) {
                if (this.hasProperty(property)) {
                    this.properties[property].delay = delay;
                } else {
                    this.setProperty(property, {
                        delay: delay
                    });
                }
            },
            
            setPropertyTimingFn: function(property, timingFn) {
                if (this.hasProperty(property)) {
                    this.properties[property].timingFn = timingFn;
                } else {
                    this.setProperty(property, {
                        timingFn: timingFn
                    });
                }
            },
            
            addIn: function(transitionDefinition) {
                var property, addProps, i;
                addProps = transitionDefinition.getProperties();
                for (i = 0; i !== addProps.length; i += 1) {
                    property = addProps[i];
                    this.setProperty(property, {
                        duration: transitionDefinition.getPropertyDuration(property),
                        delay: transitionDefinition.getPropertyDelay(property),
                        timingFn: transitionDefinition.getPropertyTimingFn(property)
                    });
                }
            },
            
            takeOut: function(transitionDefinition) {
                var subProps, i;
                subProps = transitionDefinition.getProperties();
                for (i = 0; i !== subProps.length; i += 1) {
                    if(this.hasProperty(subProps[i])) {
                        this.removeProperty(subProps[i]);
                    }
                }
            },
            
            areAllDurationsZero: function() {
                var property, subProps, i, allZeros;
                allZeros = true;
                subProps = this.getProperties();
                for (i = 0; i !== subProps.length; i += 1) {
                    property = subProps[i];
                    if(this.hasProperty(property)) {
                        allZeros = allZeros && this.getPropertyDuration(property) === 0;
                    }
                }
                return allZeros;
            },
            
            _getPropertyAttribute: function(property, attribute) {
                if(this.hasProperty(property)) {
                    return this.properties[property][attribute];
                }
                return undefined;
            }
        });
           
        TransitionDefinition.easingLookup = new EasingLookup();
        
        TransitionDefinition.defaults = {
            duration: 840,
            delay: 0,
            timingFn: TransitionDefinition.easingLookup.easeInOut
        };
        
        return TransitionDefinition;
    }
);