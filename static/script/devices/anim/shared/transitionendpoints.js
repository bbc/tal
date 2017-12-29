/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.transitionendpoints class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/anim/shared/transitionendpoints',
    [
        'antie/class'
    ],
    function(Class) {
        'use strict';
        var TransitionEndPoints;

        /*
         * A class to store information about the end points of a specific transition:
         * The start and end values of properties plus and any associated callbacks.
         */
        TransitionEndPoints = Class.extend(
            {
                init: function init (options) {
                    this._to = {};
                    this._from = {};
                    this._onComplete = function() {};
                    if(options) {
                        this.setFromOptions(options);
                    }
                },

                setFromOptions: function setFromOptions (options) {
                    var property;
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

                addUnitsToPropertyValue: function addUnitsToPropertyValue (property, value, unit) {
                    unit = unit || this.units[property] || TransitionEndPoints.defaultUnits[property];
                    if(unit !== undefined) {
                        return value + unit;
                    }
                    return value;
                },

                hasProperty: function hasProperty (property) {
                    return this._to.hasOwnProperty(property);
                },

                getProperties: function getProperties () {
                    var prop, propArray;
                    propArray = [];
                    for (prop in this._to) {
                        if(this._to.hasOwnProperty(prop)) {
                            propArray.push(prop);
                        }
                    }
                    return propArray;
                },

                getPropertyDestination: function getPropertyDestination (prop) {
                    if(this._to.hasOwnProperty(prop)) {
                        return this._to[prop];
                    }
                    return undefined;
                },

                getPropertyOrigin: function getPropertyOrigin (prop) {
                    if(this._from.hasOwnProperty(prop)) {
                        return this._from[prop];
                    }
                    return undefined;
                },

                getOnCompleteCallback: function getOnCompleteCallback () {
                    return this._onComplete;
                },

                shouldSkip: function shouldSkip () {
                    return (!!this._skipAnim || this.toAndFromAllEqual());
                },

                toAndFromAllEqual: function toAndFromAllEqual () {
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

                completeOriginsUsingElement: function completeOriginsUsingElement (el) {
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

                _addValuesToFrom: function _addValuesToFrom (property, options) {
                    if(options.from && options.from.hasOwnProperty(property)) {
                        this._from[property] = this.addUnitsToPropertyValue(property, options.from[property]);
                    }
                }
            }
        );

        TransitionEndPoints.defaultUnits = {
            top:    'px',
            left:   'px',
            bottom: 'px',
            right:  'px',
            width:  'px',
            height: 'px'
        };

        return TransitionEndPoints;
    }
);
