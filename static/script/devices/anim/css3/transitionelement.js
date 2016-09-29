/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */
define(
    'antie/devices/anim/css3/transitionelement',
    [
        'antie/class',
        'antie/devices/anim/css3/stringhelpers'
    ],
    function(Class, StringHelpers) {
        'use strict';
        /*
         * Handles all interactions with the DOM element during a transition
         */
        return Class.extend(
            {
                init: function(element) {
                    this._element = element;
                    this._strHelper = new StringHelpers();
                    this._prefixes = ['', '-webkit-', '-moz-', '-o-'];
                    this._transitionEndEvents = ['webkitTransitionEnd', 'oTransitionEnd', 'otransitionend', 'transitionend'];
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
                    endEvents = this._transitionEndEvents;
                    for(i = 0; i !== endEvents.length; i+= 1) {
                        endEvent = endEvents[i];
                        this._element.addEventListener(endEvent, callback);
                    }
                },

                removeCallback: function(callback) {
                    var endEvents, endEvent, i;
                    endEvents = this._transitionEndEvents;
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

                setStylePropertyValueWithPrefixes: function(property, value) {
                    var self = this;
                    var prefix;

                    for (var i = 0; i < self._prefixes.length; i += 1) {
                        prefix = self._prefixes[i];
                        self._element.style.setProperty(prefix + property, value, '');
                    }
                },

                getComputedStyle: function() {
                    return window.getComputedStyle(this._element, null);
                },

                _getCssCsvPropValueAsArray: function(cssProp) {
                    var value, propArr;

                    value = this._element.style.getPropertyValue(cssProp);

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

                    this.setStylePropertyValueWithPrefixes('transition-property', transitionProperties);
                },

                _setDurations: function(durations) {
                    var durationString, i;
                    for(i = 0; i !== durations.length; i += 1) {
                        durations[i] += 'ms';
                    }
                    durationString = this._strHelper.buildCsvString(durations);

                    this.setStylePropertyValueWithPrefixes('transition-duration', durationString);
                },

                _setDelays: function(delays) {
                    var delayString, i;
                    for(i = 0; i !== delays.length; i += 1) {
                        delays[i] += 'ms';
                    }
                    delayString = this._strHelper.buildCsvString(delays);
                    this.setStylePropertyValueWithPrefixes('transition-delay', delayString);
                },

                _setTimingFns: function(timings) {
                    var timingString;
                    timingString = this._strHelper.buildCsvString(timings);
                    this.setStylePropertyValueWithPrefixes('transition-timing-function', timingString);
                },

                isEventTarget: function(evt) {
                    return evt.target === this._element;
                }
            }
        );
    }
);
