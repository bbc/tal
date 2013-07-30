/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.transition class.
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
    'antie/devices/anim/css3/transition',
    [
        'antie/class',
        'antie/devices/anim/css3/transitionelement',
        'antie/devices/anim/css3/existingtransitiondefinition',
        'antie/devices/anim/css3/skipanimtransitiondefinition'
    ],
    
    function(Class, TransitionElement, ExisitingTransitionDefinition, SkipAnimTransitionDefinition) {
        "use strict";
        
        return Class.extend(
            {
                /*
                 * A specific transition on an element from some values to some other values with associated callback
                 * @param {TransitionDefinition} transDef Defines the style of transition
                 * @param {EndPoints} endPoints Defines start, end and associated callbacks of the transition
                 * @param {Object} element the DOM element the transition is to be applied to
                 */
                init: function(transDef, endPoints, element) {
                    var combinedTransitions, shouldSkip;
                    
                    this._endPoints = endPoints;
                    this._completed = false;
                    this._transEl = new TransitionElement(element);
                    this._ownTransitions = transDef;
                    this._endFn = this._genTransEndFn();
                    
                    shouldSkip = this._isTransitionInstant();
                    
                    if(shouldSkip) {
                        this._ownTransitions = new SkipAnimTransitionDefinition(this._ownTransitions);
                    }
                    
                    combinedTransitions = new ExisitingTransitionDefinition(this._transEl);
                    combinedTransitions.addIn(this._ownTransitions);
                    
                    this._setInitialValues(); 
                    this._forceUpdate();
                    this._transEl.applyDefinition(combinedTransitions);               
                    this._transEl.setCallback(this._endFn);
                    this._forceUpdate();
                    this._doTransition();
                    
                    if(shouldSkip) {
                        this.stop(true);
                    }
                },
                
                stop: function(skipToEnd) {
                    var currentStyle, currentProps, transitionTargets, prop, i, skip;
                    if(!this._completed) {
                        skip = skipToEnd;
                        if(typeof skip !== 'boolean') {
                            skip = true;
                        }
                        if(skip) {
                            this._endFn();
                        } else {
                            transitionTargets = this._ownTransitions.getProperties();
                            currentStyle = this._transEl.getComputedStyle();
                            currentProps = {};
                            
                            for(i = 0; i !== transitionTargets.length; i += 1) {
                                prop = transitionTargets[i];
                                currentProps[prop] = currentStyle[prop] || 0;
                            }
                            
                            this._endFn();
                            this._forceUpdate();
                            
                            for(i = 0; i !== transitionTargets.length; i += 1) {
                                this._transEl.setStylePropertyValue(prop, currentProps[prop]);
                            }
                        }
                    }
                },           
                
                _setInitialValues: function() {
                    var properties, origin, i, prop;
                    properties = this._endPoints.getProperties();
                    
                    for(i = 0; i !== properties.length; i += 1) {
                        prop = properties[i];
                        origin = this._endPoints.getPropertyOrigin(prop);
                        if(origin === undefined) {
                            origin = this._transEl.getStylePropertyValue(prop) || this._endPoints.addUnitsToPropertyValue(prop, 0);
                        }
                        this._transEl.setStylePropertyValue(prop, origin);
                    }
                },
                
                /* forces re-calc of style */
                _forceUpdate: function() {
                    var transitionTargets;
                    transitionTargets = this._ownTransitions.getProperties();
                    if(transitionTargets.length > 0) {
                        this._transEl.forceUpdate(transitionTargets[0]);
                    }
                },
                
                _genTransEndFn: function() {
                    var self;
                    self = this;
                    function endFn(evt) {
                        var resetTransitions;
                        
                        // check either called directly or event is firing for property on this transition
                        
                        if(!evt || (self._transEl.isEventTarget(evt) && self._ownTransitions.hasProperty(evt.propertyName))){
                            self._completed = true;
                            self._transEl.removeCallback(endFn);

                            resetTransitions = new ExisitingTransitionDefinition(self._transEl);
                            resetTransitions.takeOut(self._ownTransitions);
                            self._transEl.applyDefinition(resetTransitions);
                            
                            if(typeof self._endPoints.getOnCompleteCallback() === 'function') {
                                self._endPoints.getOnCompleteCallback()();
                            } 
                            
                            //device.removeClassFromElement(device.getTopLevelElement(), "animating");
                            //device.addClassToElement(device.getTopLevelElement(), "notanimating");
                            //device.removeClassFromElement(element, "transition");
                        }
                        
                    }
                    return endFn;
                },
                
                _doTransition: function() {
                    var prop, destination, properties, i;
                    properties = this._endPoints.getProperties();
                    for(i = 0; i !== properties.length; i += 1) {
                        prop = properties[i];
                        destination = this._endPoints.getPropertyDestination(prop);
                        this._transEl.setStylePropertyValue(prop, destination);
                    }
                },
                
                _isTransitionInstant: function() {
                    var instant = this._ownTransitions.areAllDurationsZero();
                    instant = instant || this._endPoints.shouldSkip();
                    instant = instant || this._isThereNoChange();
                    return instant;
                },
                
                _isThereNoChange: function() {
                    var targetProperties, prop, i, changed, self;
                    
                    function targetDifferentToCurrent(prop) {
                        var current;
                        current = self._transEl.getStylePropertyValue(prop);
                        return (self._endPoints.getPropertyDestination(prop) !== current);
                    }
                    
                    self = this;
                    changed = false;
                    targetProperties = this._endPoints.getProperties();
                    for(i = 0; i !== targetProperties.length; i +=1) {
                        prop = targetProperties[i];
                        changed = changed || targetDifferentToCurrent(prop);
                    }
                    
                    return !changed;
                }
            }
        );
    }
);