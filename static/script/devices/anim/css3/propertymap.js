/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.propertymap class.
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
    'antie/devices/anim/css3/propertymap',
    [
        'antie/class'
    ],
    function (Class) {
        "use strict";
        
        /*
         * Abstracts browser specific prefixes for css3 transition attributes
         */
        return Class.extend(
            {
                init: function(prefix) {
                    this.prefix = (typeof prefix === 'string') ? prefix : this._sniffPrefix();
                    this.transitionEndEvents = this._getTransitionEndEvents(this.prefix);
                    this._setPrefixes(this, this.prefix);
                },
                
                _properties: [
                    "transition",
                    "transition-property",
                    "transition-duration",
                    "transition-timing-function",
                    "transition-delay",
                    "transform"
                ],
                
                _sniffPrefix: function() {
                    if (/WebKit/.test(navigator.userAgent) ) {
                        return "-webkit-";
                    }
                    if (/Gecko/.test(navigator.userAgent) ) {
                        return "-moz-";
                    }
                    if (/Opera/.test(navigator.userAgent) ) {
                        return "-o-";
                    }
                    return "";
                },
            
                _getTransitionEndEvents: function(prefix) {
                    var endEvents;
                    switch (prefix){
                        case "-webkit-":
                            endEvents = ["webkitTransitionEnd"];
                            break;
                        case "-moz-":
                            endEvents = ["transitionend"];
                            break;
                        case "-o-":
                            endEvents = ["oTransitionEnd", "otransitionend"];
                            break;
                        default:
                            endEvents = ["transitionend"];
                        }
                    return endEvents;
                },
            
                _addPrefix: function(original, prefix) {
                    var modified;
                    if (prefix !== "") {
                        modified = prefix + original;
                    }
                    return modified;
                },
                
                _setPrefixes: function(applyTo, prefix) {
                    var i;
                    for(i = 0; i !== this._properties.length; i += 1) {
                        applyTo[this._properties[i]] = this._addPrefix(this._properties[i], prefix);
                    }
                }
            }
        );

    }
);