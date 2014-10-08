/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.transitionelement class.
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
    'antie/devices/anim/css3/transitionelement',
    [
        'antie/class',
        'antie/devices/anim/css3/propertymap',
        'antie/devices/anim/css3/stringhelpers'
    ],
    function(Class, PropertyMap, StringHelpers) {
        "use strict";
        
        /*
         * Handles all interactions with the DOM element during a transition
         */
        return Class.extend( 
            {
                init: function(element) {
                    this._element = element;
                    this._propMap = new PropertyMap();
                    this._strHelper = new StringHelpers(); 
                },
                        
                getProperties: function() {
                    return this._getCssCsvPropValueAsArray('transition-property');
                },
        
                getDurations: function() {
                    var durStrings, durations, i;
                    durations = [];
                    durStrings = this._getCssCsvPropValueAsArray('transition-duration');
                    // Assuming that we are setting all timings, i.e. they're in ms.
                    for(i = 0; i !== durStrings.length; i += 1) {
                        durations.push(parseInt(durStrings[i], 10));
                    }
                    return durations;
                },
                
                getDelays: function() {
                    var delayStrings, delays, i;
                    delays = [];
                    delayStrings = this._getCssCsvPropValueAsArray('transition-delay');
                    // Assuming that we are setting all timings, i.e. they're in ms.
                    for(i = 0; i !== delayStrings.length; i += 1) {
                        delays.push(parseInt(delayStrings[i], 10));
                    }
                    return delays;
                },
        
                getTimingFns: function() {
                    return this._getCssCsvPropValueAsArray('transition-timing-function');
                },
                       
                setCallback: function(callback) {
                    var endEvents, endEvent, i;
                    endEvents = this._propMap.transitionEndEvents;
                    for(i = 0; i !== endEvents.length; i+= 1) {
                        endEvent = endEvents[i];
                        this._element.addEventListener(endEvent, callback);
                    }
                },
                
                removeCallback: function(callback) {
                    var endEvents, endEvent, i;
                    endEvents = this._propMap.transitionEndEvents;
                    for(i = 0; i !== endEvents.length; i+= 1) {
                        endEvent = endEvents[i];
                        this._element.removeEventListener(endEvent, callback);
                    }
                },
                
                applyDefinition: function(transitionDefinition) {
                    var transProperties, property, delays, durations, props, timingFns, i;
                    delays = []; 
                    props = []; 
                    timingFns = []; 
                    durations = [];
                    
                    transProperties = transitionDefinition.getProperties();
                    for(i = 0; i !== transProperties.length; i += 1) {
                        property = transProperties[i];
                        props.push(property);
                        delays.push(transitionDefinition.getPropertyDelay(property));
                        timingFns.push(transitionDefinition.getPropertyTimingFn(property));
                        durations.push(transitionDefinition.getPropertyDuration(property));
                    }
                    
                    this._setDurations(durations);
                    this._setDelays(delays);
                    this._setTimingFns(timingFns);
                    this._setProperties(props);
                },
                
                /*
                 * Forces update of style; several browsers don't handle CSS transitions correctly, but you can force
                 * them to by accessing the computed style of the element after changing it.
                 * See http://louisremi.com/2012/06/05/working-around-css-transitions-bugs-with-getcomputedstyle/
                 */
                forceUpdate: function(property) {
                    var style = this.getComputedStyle();
                    return (style) ? style[property] : null;
                },
                
                getStylePropertyValue: function(property) {
                    return this._element.style.getPropertyValue(property);
                },
                
                setStylePropertyValue: function(property, value) {
                    this._element.style.setProperty(property, value, '');
                },
                
                getComputedStyle: function() {
                    return window.getComputedStyle(this._element, null);
                },
                
                _getCssCsvPropValueAsArray: function(cssProp) {
                    var value, propArr;
                    value = this._element.style.getPropertyValue(this._propMap[cssProp]);
                    
                    if(value !== null && value !== undefined) {
                        value = String(value);
                    }
                    
                    if (typeof value === 'string') {
                        propArr = this._strHelper.splitStringOnNonParenthesisedCommas(value);
                    } else {
                        propArr = [];
                    }
                    
                    return propArr;
                },
                
                _setProperties: function(properties) {
                    var transitionProperties;
                    transitionProperties = this._strHelper.buildCsvString(properties);
                    this.setStylePropertyValue(this._propMap["transition-property"], transitionProperties);
                },
                
                _setDurations: function(durations) {
                    var durationString, i;
                    for(i = 0; i !== durations.length; i += 1) {
                        durations[i] += "ms";
                    }
                    durationString = this._strHelper.buildCsvString(durations);
                    this.setStylePropertyValue(this._propMap["transition-duration"], durationString);
                },
                
                _setDelays: function(delays) {
                    var delayString, i;
                    for(i = 0; i !== delays.length; i += 1) {
                        delays[i] += "ms";
                    }
                    delayString = this._strHelper.buildCsvString(delays);
                    this.setStylePropertyValue(this._propMap["transition-delay"], delayString);
                },
                
                _setTimingFns: function(timings) {
                    var timingString;
                    timingString = this._strHelper.buildCsvString(timings);
                    this.setStylePropertyValue(this._propMap["transition-timing-function"], timingString);
                },

				isEventTarget: function(evt) {
					return evt.target === this._element;
				}
            }
        );
    }
);