/**
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

(function() {
    /* jshint newcap: false */
    function loadSH(queue, fn) {
        queuedRequire(queue,
            ['antie/devices/anim/css3/stringhelpers'],
            fn
        );
    }
    
    this.StringHelpersTest = AsyncTestCase("StringHelpers");

    this.StringHelpersTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.StringHelpersTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };
    
    this.StringHelpersTest.prototype.testCsvSplitOnNonParenthesisedCommas = function(queue) {
        loadSH(queue,
            function(StringHelpers) {
               var sHelpers, csvString, csvExpectedArray;
               sHelpers = new StringHelpers();
               csvString = "token1, token2,token3,token4 , token5,6,0,someFunction(with, parenthesised, parameters)";
               csvExpectedArray = ["token1","token2","token3","token4","token5","6","0","someFunction(with, parenthesised, parameters)"];
               assertEquals(csvExpectedArray, sHelpers.splitStringOnNonParenthesisedCommas(csvString));              
            }
        );
    };
    
    this.StringHelpersTest.prototype.testStripWhiteSpace = function(queue) {
        loadSH(queue,
            function(StringHelpers){
                var original, expected, sHelpers;
                sHelpers = new StringHelpers();
                original = " \n 0bl, ah \t  ";
                expected = "0bl, ah";
                assertEquals(expected, sHelpers.stripWhiteSpace(original));
            });
    };
    
    this.StringHelpersTest.prototype.testCsvAppend = function(queue) {
        loadSH(queue,
            function(StringHelpers) {
               var sHelpers;
               sHelpers = new StringHelpers();
               assertEquals('append to empty string returns appended element', "appended", sHelpers.csvAppend("", "appended"));
               assertEquals('append to existing string has comma seperator', "original,appended", sHelpers.csvAppend("original", "appended"));
               assertEquals('appending to csv returns csv with extra element', "original,appended,final", sHelpers.csvAppend("original,appended", "final"));
            }
        );
    };
    
    this.StringHelpersTest.prototype.testCsvBuildFromArray = function(queue) {
        loadSH(queue,
            function(StringHelpers) {
               var sHelpers, inArray;
               sHelpers = new StringHelpers();
               inArray = ["one", "two", "three,four", "five"];
               assertEquals("one,two,three,four,five", sHelpers.buildCsvString(inArray));
            }
        );
    };
}());