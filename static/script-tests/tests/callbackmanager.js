/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {
    this.CallbackManagerTest = AsyncTestCase('CallbackManagerTest');

    this.CallbackManagerTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.CallbackManagerTest.prototype.tearDown = function() {
        this.sandbox.restore();
    };

    this.CallbackManagerTest.prototype.testCallAllArgPassedToAddedCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ['antie/callbackmanager'], function(CallbackManager) {

            var instance = new CallbackManager();

            var callback = this.sandbox.stub();

            instance.addCallback(null, callback);
            instance.callAll(99);

            assert(callback.calledOnce);
            assert(callback.calledWith(99));
        });
    };

    this.CallbackManagerTest.prototype.testMultipleCallAllArgsPassedToAddedCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ['antie/callbackmanager'], function(CallbackManager) {

            var instance = new CallbackManager();

            var callback = this.sandbox.stub();

            instance.addCallback(null, callback);
            instance.callAll(1,2,3,4,5);

            assert(callback.calledOnce);
            assert(callback.calledWith(1,2,3,4,5));
        });
    };

    this.CallbackManagerTest.prototype.testCallAllUsesThisArgWithAddedCallback = function (queue) {
        expectAsserts(1);
        queuedRequire(queue, ['antie/callbackmanager'], function(CallbackManager) {

            var instance = new CallbackManager();

            var val = 0;

            var callback = function() {
                val = this.myProp;
            };

            var thisArg = {
                myProp: 'test'
            };

            instance.addCallback(thisArg, callback);
            instance.callAll();

            assertEquals('test', val);
        });
    };

    this.CallbackManagerTest.prototype.testMultipleCallbacksUsesTheirOwnThisArgs = function (queue) {
        expectAsserts(1);
        queuedRequire(queue, ['antie/callbackmanager'], function(CallbackManager) {

            var instance = new CallbackManager();

            var vals = [];

            var callback = function() {
                vals.push(this.myProp);
            };

            var thisArg1 = {
                myProp: 'one'
            };
            var thisArg2 = {
                myProp: 'two'
            };

            instance.addCallback(thisArg1, callback);
            instance.addCallback(thisArg2, callback);
            instance.callAll();

            assertEquals(['one', 'two'], vals);
        });
    };

    this.CallbackManagerTest.prototype.testMultipleAdditionsOfOneCallbackStillOnlyAddsOnce = function (queue) {
        expectAsserts(1);
        queuedRequire(queue, ['antie/callbackmanager'], function(CallbackManager) {

            var instance = new CallbackManager();

            var callback = this.sandbox.stub();

            var thisArg = { };

            instance.addCallback(thisArg, callback);
            instance.addCallback(thisArg, callback);
            instance.callAll();

            assert(callback.calledOnce);
        });
    };

    this.CallbackManagerTest.prototype.testRemoveAllCallbacksRemovesThemAll = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ['antie/callbackmanager'], function(CallbackManager) {

            var instance = new CallbackManager();

            var callback = this.sandbox.stub();
            var callback2 = this.sandbox.stub();

            instance.addCallback(null, callback);
            instance.addCallback(null, callback2);
            instance.removeAllCallbacks();
            instance.callAll();

            assert(callback.notCalled);
            assert(callback2.notCalled);
        });
    };

    this.CallbackManagerTest.prototype.testRemoveCallbackRemovesASpecificCallback = function (queue) {
        expectAsserts(2);
        queuedRequire(queue, ['antie/callbackmanager'], function(CallbackManager) {

            var instance = new CallbackManager();

            var callback = this.sandbox.stub();
            var callback2 = this.sandbox.stub();

            instance.addCallback(null, callback);
            instance.addCallback(null, callback2);
            instance.removeCallback(null, callback);
            instance.callAll();

            assert(callback.notCalled);
            assert(callback2.calledOnce);
        });
    };

    this.CallbackManagerTest.prototype.testRemoveCallbackRemovesASpecificCallbackWithCorrectThisArg = function (queue) {
        expectAsserts(1);
        queuedRequire(queue, ['antie/callbackmanager'], function(CallbackManager) {

            var instance = new CallbackManager();

            var vals = [];

            var callback = function() {
                vals.push(this.myProp);
            };

            var thisArg1 = {
                myProp: 'one'
            };
            var thisArg2 = {
                myProp: 'two'
            };

            instance.addCallback(thisArg1, callback);
            instance.addCallback(thisArg2, callback);
            instance.removeCallback(thisArg2, callback);
            instance.callAll();

            assertEquals(['one'], vals);
        });
    };

})();
