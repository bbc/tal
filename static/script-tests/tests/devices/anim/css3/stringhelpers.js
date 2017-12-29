/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    function loadSH(queue, fn) {
        queuedRequire(queue,
                      ['antie/devices/anim/css3/stringhelpers'],
                      fn
                     );
    }

    this.StringHelpersTest = AsyncTestCase('StringHelpers');

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
                   csvString = 'token1, token2,token3,token4 , token5,6,0,someFunction(with, parenthesised, parameters)';
                   csvExpectedArray = ['token1','token2','token3','token4','token5','6','0','someFunction(with, parenthesised, parameters)'];
                   assertEquals(csvExpectedArray, sHelpers.splitStringOnNonParenthesisedCommas(csvString));
               }
              );
    };

    this.StringHelpersTest.prototype.testStripWhiteSpace = function(queue) {
        loadSH(queue,
               function(StringHelpers){
                   var original, expected, sHelpers;
                   sHelpers = new StringHelpers();
                   original = ' \n 0bl, ah \t  ';
                   expected = '0bl, ah';
                   assertEquals(expected, sHelpers.stripWhiteSpace(original));
               });
    };

    this.StringHelpersTest.prototype.testCsvAppend = function(queue) {
        loadSH(queue,
               function(StringHelpers) {
                   var sHelpers;
                   sHelpers = new StringHelpers();
                   assertEquals('append to empty string returns appended element', 'appended', sHelpers.csvAppend('', 'appended'));
                   assertEquals('append to existing string has comma seperator', 'original,appended', sHelpers.csvAppend('original', 'appended'));
                   assertEquals('appending to csv returns csv with extra element', 'original,appended,final', sHelpers.csvAppend('original,appended', 'final'));
               }
              );
    };

    this.StringHelpersTest.prototype.testCsvBuildFromArray = function(queue) {
        loadSH(queue,
               function(StringHelpers) {
                   var sHelpers, inArray;
                   sHelpers = new StringHelpers();
                   inArray = ['one', 'two', 'three,four', 'five'];
                   assertEquals('one,two,three,four,five', sHelpers.buildCsvString(inArray));
               }
              );
    };
}());
