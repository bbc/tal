/**
 * @fileOverview Requirejs module containing base antie.devices.anim.css3.stringhelpers class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/anim/css3/stringhelpers',
    [
        'antie/class'
    ],
    function(Class) {
        'use strict';
        return Class.extend(
            {
                stripWhiteSpace: function stripWhiteSpace (str) {
                    return str.replace(/(^\s+|\s+$)/g,'');
                },

                csvAppend: function csvAppend (existing, additional) {
                    var retStr;
                    if (existing === '') {
                        retStr = additional;
                    } else {
                        retStr = existing + ',' + additional;
                    }
                    return retStr;
                },

                buildCsvString: function buildCsvString (arr) {
                    var i, csvString;
                    csvString = '';
                    for (i = 0; i !== arr.length; i += 1) {
                        csvString = this.csvAppend(csvString, arr[i]);
                    }
                    return csvString;
                },

                splitStringOnNonParenthesisedCommas: function splitStringOnNonParenthesisedCommas (inString) {
                    var parenthCount, i, tokens, currentSegment, currentChar;
                    tokens = [];
                    parenthCount = 0;
                    currentSegment = '';
                    for(i = 0; i !== inString.length; i += 1) {
                        currentChar = inString.charAt(i);
                        if(currentChar === '(') {
                            parenthCount += 1;
                        }
                        if(currentChar === ')') {
                            parenthCount -= 1;
                        }
                        if((parenthCount === 0 && currentChar === ',')) {
                            currentSegment = this.stripWhiteSpace(currentSegment);
                            if(currentSegment !== '') {
                                tokens.push(currentSegment);
                            }
                            currentSegment = '';
                        } else {
                            currentSegment += currentChar;
                        }
                    }

                    currentSegment = this.stripWhiteSpace(currentSegment);
                    if(currentSegment !== '') {
                        tokens.push(currentSegment);
                    }

                    return tokens;

                }
            }
        );
    }
);
