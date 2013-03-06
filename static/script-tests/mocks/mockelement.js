/**
 * @fileOverview Mock a DOM element for testing.
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

sinon = sinon || {};

require.def(
    'mocks/mockelement',
    [
        'antie/class'
    ],
    function (Class){
        "use strict";
        var MockElement = Class.extend({
            init: function(tProps, tDurs, tTimeFns, leftVal, opacityVal) {
                var self;
                
                self = this;
                this.style = {};
                
                this.style["transition-property"] = tProps || MockElement.defaultTransProperty;
                this.style["transition-duration"] = tDurs || MockElement.defaultTransDuration;
                this.style["transition-timing-function"] = tTimeFns || MockElement.defaultTransTimingFn;
                this.style["transition-delay"] = tTimeFns || MockElement.defaultTransDelay;
                this.style["-webkit-transition-property"] = this.style["transition-property"];
                this.style["-o-transition-property"] = this.style["transition-property"];
                this.style["-moz-transition-property"] = this.style["transition-property"];
                this.style["-webkit-transition-duration"] = this.style["transition-duration"];
                this.style["-o-transition-duration"] = this.style["transition-duration"];
                this.style["-moz-transition-duration"] = this.style["transition-duration"];
                this.style["-webkit-transition-timing-function"] = this.style["transition-timing-function"];
                this.style["-o-transition-timing-function"] = this.style["transition-timing-function"];
                this.style["-moz-transition-timing-function"] = this.style["transition-timing-function"];
                this.style["-webkit-transition-delay"] = this.style["transition-delay"];
                this.style["-o-transition-delay"] = this.style["transition-delay"];
                this.style["-moz-transition-delay"] = this.style["transition-delay"];
                
                this.style.testProperty = "somethingOrOther";
                this.style.left = leftVal || "auto";
                this.style.opacity = opacityVal || null;
                
                this.style.getPropertyValue = function(prop) {
                    return self.style[prop];       
                };
                this.style.setProperty = function(prop, value) {
                };
                this.addEventListener = function(event, callback) {};
                this.removeEventListener = function(event, callback) {};
                //sinon.spy(this.style, "setProperty");                
            }
        });
        
        MockElement.defaultTransProperty = "top, left, opacity";
        MockElement.defaultTransDuration = "400ms, 2000ms, 600ms";
        MockElement.defaultTransTimingFn = "linear, easeInOut, beizer(0, .6, 0.3, -4)";
        MockElement.defaultTransDelay = "0ms, 100ms, 5ms";
        
        return MockElement;
    }
);