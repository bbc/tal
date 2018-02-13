/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

/**
 * @fileOverview Mock a DOM element for testing.
 */

sinon = sinon || {};

require.def(
    'mocks/mockelement',
    [
        'antie/class'
    ],
    function (Class){
        'use strict';
        var MockElement = Class.extend({
            init: function(tProps, tDurs, tTimeFns, leftVal, opacityVal) {
                var self;

                self = this;
                this.style = {};

                this.style['transition-property'] = tProps || MockElement.defaultTransProperty;
                this.style['transition-duration'] = tDurs || MockElement.defaultTransDuration;
                this.style['transition-timing-function'] = tTimeFns || MockElement.defaultTransTimingFn;
                this.style['transition-delay'] = tTimeFns || MockElement.defaultTransDelay;
                this.style['-webkit-transition-property'] = this.style['transition-property'];
                this.style['-o-transition-property'] = this.style['transition-property'];
                this.style['-moz-transition-property'] = this.style['transition-property'];
                this.style['-webkit-transition-duration'] = this.style['transition-duration'];
                this.style['-o-transition-duration'] = this.style['transition-duration'];
                this.style['-moz-transition-duration'] = this.style['transition-duration'];
                this.style['-webkit-transition-timing-function'] = this.style['transition-timing-function'];
                this.style['-o-transition-timing-function'] = this.style['transition-timing-function'];
                this.style['-moz-transition-timing-function'] = this.style['transition-timing-function'];
                this.style['-webkit-transition-delay'] = this.style['transition-delay'];
                this.style['-o-transition-delay'] = this.style['transition-delay'];
                this.style['-moz-transition-delay'] = this.style['transition-delay'];

                this.style.testProperty = 'somethingOrOther';
                this.style.left = leftVal || 'auto';
                this.style.opacity = opacityVal || null;

                this.style.getPropertyValue = function(prop) {
                    return self.style[prop];
                };
                this.style.setProperty = function() {
                };
                this.addEventListener = function() {};
                this.removeEventListener = function() {};
                //sinon.spy(this.style, 'setProperty');
            }
        });

        MockElement.defaultTransProperty = 'top, left, opacity';
        MockElement.defaultTransDuration = '400ms, 2000ms, 600ms';
        MockElement.defaultTransTimingFn = 'linear, easeInOut, beizer(0, .6, 0.3, -4)';
        MockElement.defaultTransDelay = '0ms, 100ms, 5ms';

        return MockElement;
    }
);
