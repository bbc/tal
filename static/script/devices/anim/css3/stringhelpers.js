/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.stringhelpers class.
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
    'antie/devices/anim/css3/stringhelpers',
    [
        'antie/class'
    ],
    function(Class) {
        "use strict";
        return Class.extend(         
            {
                stripWhiteSpace: function(str) {
                    return str.replace(/(^\s+|\s+$)/g,'');
                },
        
                csvAppend: function(existing, additional) {
                    var retStr;
                    if (existing === "") {
                        retStr = additional;
                    } else {
                        retStr = existing + ',' + additional;
                    }
                    return retStr;
                },
                  
                buildCsvString: function(arr) {
                    var i, csvString;
                    csvString = "";
                    for (i = 0; i !== arr.length; i += 1) {
                        csvString = this.csvAppend(csvString, arr[i]);
                    }
                    return csvString;
                },
                
                splitStringOnNonParenthesisedCommas: function(inString) {
                    var parenthCount, i, tokens, currentSegment, currentChar;
                    tokens = [];
                    parenthCount = 0;
                    currentSegment = "";
                    for(i = 0; i !== inString.length; i += 1) {
                        currentChar = inString.charAt(i);
                        if(currentChar === '(') {
                            parenthCount += 1;
                        }
                        if(currentChar === ')') {
                            parenthCount -= 1;
                        }
                        if((parenthCount === 0 && currentChar === ",")) {
                            currentSegment = this.stripWhiteSpace(currentSegment);
                            if(currentSegment !== "") {
                                tokens.push(currentSegment);
                            }
                            currentSegment = "";
                        } else {
                            currentSegment += currentChar;
                        }
                    }
                    
                    currentSegment = this.stripWhiteSpace(currentSegment);
                    if(currentSegment !== "") {
                        tokens.push(currentSegment);
                    }

                    return tokens;
                    
                }
            }
        ); 
    }
);