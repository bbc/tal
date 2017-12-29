/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.transition class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/anim/css3/transition',
    [
        'antie/class',
        'antie/devices/anim/css3/transitionelement',
        'antie/devices/anim/css3/existingtransitiondefinition',
        'antie/devices/anim/css3/skipanimtransitiondefinition'
    ],

    function(Class, TransitionElement, ExisitingTransitionDefinition, SkipAnimTransitionDefinition) {
        'use strict';

        return Class.extend(
            {
                /*
                 * A specific transition on an element from some values to some other values with associated callback
                 * @param {TransitionDefinition} transDef Defines the style of transition
                 * @param {EndPoints} endPoints Defines start, end and associated callbacks of the transition
                 * @param {Object} element the DOM element the transition is to be applied to
                 */
                init: function init (transDef, endPoints, element) {
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

                stop: function stop (skipToEnd) {
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

                _setInitialValues: function _setInitialValues () {
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
                _forceUpdate: function _forceUpdate () {
                    var transitionTargets;
                    transitionTargets = this._ownTransitions.getProperties();
                    if(transitionTargets.length > 0) {
                        this._transEl.forceUpdate(transitionTargets[0]);
                    }
                },

                _genTransEndFn: function _genTransEndFn () {
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

                            //device.removeClassFromElement(device.getTopLevelElement(), 'animating');
                            //device.addClassToElement(device.getTopLevelElement(), 'notanimating');
                            //device.removeClassFromElement(element, 'transition');
                        }

                    }
                    return endFn;
                },

                _doTransition: function _doTransition () {
                    var prop, destination, properties, i;
                    properties = this._endPoints.getProperties();
                    for(i = 0; i !== properties.length; i += 1) {
                        prop = properties[i];
                        destination = this._endPoints.getPropertyDestination(prop);
                        this._transEl.setStylePropertyValue(prop, destination);
                    }
                },

                _isTransitionInstant: function _isTransitionInstant () {
                    var instant = this._ownTransitions.areAllDurationsZero();
                    instant = instant || this._endPoints.shouldSkip();
                    instant = instant || this._isThereNoChange();
                    return instant;
                },

                _isThereNoChange: function _isThereNoChange () {
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
