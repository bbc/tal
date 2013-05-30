/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.transitionendpoints class.
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
    'antie/devices/anim/shared/transitionendpoints',
    [
        'antie/class'
    ],
    function(Class) {
        "use strict";
        var TransitionEndPoints;
        
        /*
         * A class to store information about the end points of a specific transition:
         * The start and end values of properties plus and any associated callbacks.
         */
        TransitionEndPoints = Class.extend(
            {
                init: function(options) {
                    this._to = {};
                    this._from = {};
                    this._onComplete = function() {};
                    if(options) {
                        this.setFromOptions(options);
                    }
                },
                
                setFromOptions: function(options) {
                    var property, from;
                    from = options.from || {};
                    this.units = options.units || {};
                    this._skipAnim = options.skipAnim;
                    for (property in options.to) {
                        if(options.to.hasOwnProperty(property)) {
                            this._to[property] = this.addUnitsToPropertyValue(property, options.to[property]);
                            this._addValuesToFrom(property, options);
                        }
                    }
                    this._onComplete = options.onComplete || this._onComplete;
                    this.onStart = options.onStart || this.onStart;
                },
                
                addUnitsToPropertyValue: function(property, value, unit) {
                    unit = unit || this.units[property] || TransitionEndPoints.defaultUnits[property];
                    if(unit !== undefined) {
                        return value + unit;
                    }
                    return value;
                },
                
                hasProperty: function(property) {
                    return this._to.hasOwnProperty(property);
                },
                
                getProperties: function() {
                    var prop, propArray;
                    propArray = [];
                    for (prop in this._to) {
                        if(this._to.hasOwnProperty(prop)) {
                            propArray.push(prop);
                        }
                    }
                    return propArray;
                },
                
                getPropertyDestination: function (prop) {
                    if(this._to.hasOwnProperty(prop)) {
                        return this._to[prop];
                    }
                    return undefined;
                },
                
                getPropertyOrigin: function (prop) {
                    if(this._from.hasOwnProperty(prop)) {
                        return this._from[prop];
                    }
                    return undefined;
                },
                
                getOnCompleteCallback: function() {
                    return this._onComplete;    
                },
                
                shouldSkip: function() {
                    return (!!this._skipAnim || this.toAndFromAllEqual());
                },
                
                toAndFromAllEqual: function() {
                    var prop, equal;
                    equal = true;

                    for (prop in this._to) {
                        if(this._to.hasOwnProperty(prop) && this._from && this._from.hasOwnProperty(prop)) {
                            equal = equal && (this._to[prop] === this._from[prop]);
                        } else {
                            equal = false;
                        }
                    }
                    return equal;
                },
                
                completeOriginsUsingElement: function(el) {
                    function shouldReplace() {   
                        return (elementValue !== null && elementValue !== undefined && self._from[property] === undefined);
                    }
                    
                    var elementValue, self, property;
                    self = this;
                    
                    for (property in this._to) {
                        if(this._to.hasOwnProperty(property)) { 
                             elementValue = el.style.getPropertyValue(property); 
                             if(shouldReplace()) {
                                this._from[property] = elementValue; 
                            }
                        }
                    }
                },
                
                _addValuesToFrom: function(property, options) {
                    if(options.from && options.from.hasOwnProperty(property)) {
                        this._from[property] = this.addUnitsToPropertyValue(property, options.from[property]);
                    } 
                }
            }
        );  
        
        TransitionEndPoints.defaultUnits = {
            top:    "px",
            left:   "px",
            bottom: "px",
            right:  "px",
            width:  "px",
            height: "px"
        };
        
        return TransitionEndPoints;
    }
);