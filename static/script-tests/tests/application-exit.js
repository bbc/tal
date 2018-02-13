/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function() {

    this.ApplicationExitTest = AsyncTestCase('Application_Exit');

    this.ApplicationExitTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
    };

    this.ApplicationExitTest.prototype.tearDown = function() {
        this.sandbox.restore();

        if(this.application) {
            this.application.destroy();
            this.application = null;
        }
    };

    this.ApplicationExitTest.prototype.testBackWithNoHistoryCallsExit = function(queue) {

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/devices/browserdevice'
            ],
            function(application, BrowserDevice) {
                var exitStub;

                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: 'http://www.test.com/'
                    };
                });

                exitStub = this.sandbox.stub(application, 'exit', function() {});

                application.back();
                assert(exitStub.calledOnce);

            }
        );
    };

    this.ApplicationExitTest.prototype.testExitWithNoHistoryCallsDeviceExit = function(queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/devices/browserdevice'
            ],
            function(application, BrowserDevice) {
                var device, exitStub;

                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: 'http://www.test.com/'
                    };
                });

                device = application.getDevice();
                exitStub = this.sandbox.stub(device, 'exit', function() {});

                application.exit();
                assert(exitStub.calledOnce);
            }
        );
    };

    this.ApplicationExitTest.prototype.testBackWithBroadcastHistoryCallsExit = function(queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/devices/browserdevice'
            ],
            function(application, BrowserDevice) {
                var exitStub;

                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: 'http://www.test.com/#&*history=broadcast'
                    };
                });

                exitStub = this.sandbox.stub(application, 'exit', function() {});

                application.back();
                assert(exitStub.calledOnce);
            }
        );
    };

    this.ApplicationExitTest.prototype.testExitWithBroadcastHistoryCallsExitToBroadcast = function(queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/devices/browserdevice'
            ],
            function(application, BrowserDevice) {
                var device, exitToBroadcastStub;

                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: 'http://www.test.com/#&*history=broadcast'
                    };
                });

                device = application.getDevice();
                exitToBroadcastStub = this.sandbox.stub(device, 'exitToBroadcast', function() {});

                application.exit();
                assert(exitToBroadcastStub.calledOnce);
            }
        );
    };

    this.ApplicationExitTest.prototype.testBackHistoryCallsLastHistory = function(queue) {

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/devices/browserdevice'
            ],
            function(application, BrowserDevice) {
                var setUrlStub;

                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: 'http://www.test.com/#&*history=http://www.back.com/'
                    };
                });

                setUrlStub = this.sandbox.stub(BrowserDevice.prototype, 'setWindowLocationUrl', function() {});

                application.back();
                assert(setUrlStub.calledOnce);
                assert(setUrlStub.calledWith('http://www.back.com/'));
            }
        );
    };

    this.ApplicationExitTest.prototype.testHasHistoryWithNoHistoryReturnsFalse = function(queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/devices/browserdevice'
            ],
            function(application, BrowserDevice) {
                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: 'http://www.test.com/'
                    };
                });

                assertFalse('hasHistory()', application.hasHistory());
            }
        );
    };

    this.ApplicationExitTest.prototype.testHasHistoryWithHistoryReturnsTrue = function(queue) {
        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [
                'antie/devices/browserdevice'
            ],
            function(application, BrowserDevice) {
                // Configure BrowserDevice.getWindowLocation() to return canned data
                this.sandbox.stub(BrowserDevice.prototype, 'getWindowLocation', function() {
                    return {
                        href: 'http://www.test.com/#&*history=http://www.back.com/'
                    };
                });

                assert('hasHistory()', application.hasHistory());
            }
        );
    };
}());
