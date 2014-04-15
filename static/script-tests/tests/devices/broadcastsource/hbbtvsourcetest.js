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
    this.hbbtvSource = AsyncTestCase("HBBTV Broadcast Source");

    this.hbbtvSource.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();
        // Mock the HBBTV APIs and tune to BBC One
        this.stubHBBTVSpecificApis();
    };

    this.hbbtvSource.prototype.tearDown = function() {
        this.removeHBBTVSpecificApis();
        this.sandbox.restore();
    };

    this.hbbtvSource.prototype.testCreateBroadcastSourceReturnsHBBTVObject = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function(application, BaseTvSource) {
            var device = application.getDevice();
            var returnedBroadcastSource = device.createBroadcastSource();

            assertEquals('BroadcastSource should be an object', 'object', typeof returnedBroadcastSource);
            assert('BrowserDevice should extend from Device', returnedBroadcastSource instanceof BaseTvSource);
            // also check that is it of type HBBTVsource
        }, config);
    };


    this.hbbtvSource.prototype.testCreateBroadcastSourceReturnsSingletonHBBTVObject = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/hbbtvsource"], function(application, HbbTVSource) {
            var device = application.getDevice();

            var hbbtvConstructor = this.sandbox.spy(HbbTVSource.prototype, "init");

            device.createBroadcastSource();
            device.createBroadcastSource();
            device.createBroadcastSource();

            assertTrue('BroadcastSource should be an object', hbbtvConstructor.calledOnce);

        }, config);
    };

    this.hbbtvSource.prototype.testCreateBroadcastWhenHbbTvApiIsNotAvailableThrowsException = function(queue) {
        expectAsserts(1);

        this.removeHBBTVSpecificApis();

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            assertException("Unable to initialise HbbTV broadcast source", function() {
                device.createBroadcastSource();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testIsBroadcastSourceSupportedWhenHistorianDoesNotHaveBroadcastOriginReturnsFalse = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/historian"], function(application, Historian) {
            var device = application.getDevice();

            this.sandbox.stub(Historian.prototype, "hasBroadcastOrigin", function() {
                return false;
            });


            assertFalse(device.isBroadcastSourceSupported());
        }, config);
    };

    this.hbbtvSource.prototype.testIsBroadcastSourceSupportedWhenHistorianHasBroadcastOriginReturnsTrue = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/historian"], function(application, Historian) {
            var device = application.getDevice();

            this.sandbox.stub(Historian.prototype, "hasBroadcastOrigin", function() {
                return true;
            });

            assertTrue(device.isBroadcastSourceSupported());
        }, config);
    };


    this.hbbtvSource.prototype.testShowCurrentChannelSetsTheBroadcastToFullScreenAt720p = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            // Mock getBestFitLayout as unsure of the actual browser size when running in headless environment
            this.sandbox.stub(application, "getLayout", function() {
                return {
                    requiredScreenSize: { height: 720, width: 1280 }
                };
            });

            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertEquals('BroadcastSource width should be 1280px', '1280px', this.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 720px', '720px', this.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testShowCurrentChannelSetsTheBroadcastToFullScreenAt1080p = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();

            // Mock getBestFitLayout as unsure of the browser size when running headless
            this.sandbox.stub(application, "getLayout", function() {
                return {
                    requiredScreenSize: { height: 1080, width: 1920 }
                };
            });

            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertEquals('BroadcastSource width should be 1920px', '1920px', this.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 1080px', '1080px', this.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testSetPositionWithOffsetSetsTheCorrectCSSProperties = function(queue) {
        expectAsserts(4);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.setPosition(10, 20, 30, 40);

            assertEquals('BroadcastSource top position should be 10px', '10px', this.hbbtvPlugin.style.top);
            assertEquals('BroadcastSource left position should be 20px', '20px', this.hbbtvPlugin.style.left);
            assertEquals('BroadcastSource width should be 30px', '30px', this.hbbtvPlugin.style.width);
            assertEquals('BroadcastSource height should be 40px', '40px', this.hbbtvPlugin.style.height);
        }, config);
    };

    this.hbbtvSource.prototype.testShowCurrentChannelCallsHBBTVbindToCurrentChannel = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var hbbtvApiSpy = this.sandbox.spy(this.hbbtvPlugin, "bindToCurrentChannel");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.showCurrentChannel();
            assertTrue("Native HBBTV bindToCurrentChannel function called", hbbtvApiSpy.called);
        }, config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelCallsHBBTVStop = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var hbbtvApiSpy = this.sandbox.spy(this.hbbtvPlugin, "stop");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.stopCurrentChannel();
            assertTrue("Native HBBTV stop function called", hbbtvApiSpy.called);
        }, config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelThrowsExceptionIfPlayStateIsUnrealizedAndBindToCurrentChannelThrowsException = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            this.sandbox.stub(this.hbbtvPlugin, "playState", broadcastSource._playStates.UNREALIZED);

            var hbbtvPlugin = document.getElementById('broadcastVideoObject');
            hbbtvPlugin.bindToCurrentChannel = function() {
                throw new Error("BindToCurrentChannel error");
            };

            assertException("Unable to bind to current channel", function() {
                broadcastSource.stopCurrentChannel();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelCallsBindWhenUnrealized = function(queue) {
        expectAsserts(1);
        var config;
        config = this.getGenericHBBTVConfig();

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application) {
                var hbbtvBindSpy, hbbtvPlayStateStub, broadcastSource;
                broadcastSource = application.getDevice().createBroadcastSource();
                hbbtvBindSpy = this.sandbox.spy(this.hbbtvPlugin, "bindToCurrentChannel");
                hbbtvPlayStateStub = this.sandbox.stub(this.hbbtvPlugin, "playState", broadcastSource._playStates.UNREALIZED);
                broadcastSource.stopCurrentChannel();
                assertTrue("Native HBBTV bindToCurrentChannel function called", hbbtvBindSpy.called);
            },
            config);
    };

    this.hbbtvSource.prototype.testStopCurrentChannelDoesNotCallBindWhenNotUnrealized = function(queue) {
        expectAsserts(1);
        var config;
        config = this.getGenericHBBTVConfig();

        queuedApplicationInit(
            queue,
            'lib/mockapplication',
            [],
            function(application) {
                var hbbtvBindSpy, hbbtvPlayStateStub, broadcastSource;
                broadcastSource = application.getDevice().createBroadcastSource();
                hbbtvBindSpy = this.sandbox.spy(this.hbbtvPlugin, "bindToCurrentChannel");
                hbbtvPlayStateStub = this.sandbox.stub(this.hbbtvPlugin, "playState", broadcastSource._playStates.PRESENTING);
                broadcastSource.stopCurrentChannel();
                assertFalse("Native HBBTV bindToCurrentChannel function called", hbbtvBindSpy.called);
            },
            config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameGetsTheHBBTVCurrentChannelProperty = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var channelName = broadcastSource.getCurrentChannelName();
            assertEquals('Channel name should be BBC One', 'BBC One', channelName);
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelObjectIsNull = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel = null;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException("Current channel name not available", function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelNamePropertyIsNull = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel.name = null;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException("Current channel name is null", function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testgetCurrentChannelNameThrowsExceptionWhenHBBTVCurrentChannelNamePropertyIsUndefined = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel.name = undefined;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertException("Current channel name is not defined", function() {
                broadcastSource.getCurrentChannelName();
            });
        }, config);
    };

    this.hbbtvSource.prototype.testGetPlayStateReturnsHBBTVPlayStateProperty = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var playState = broadcastSource.getPlayState();
            assertEquals("hbbTvObjectPlayState", playState);
        }, config);
    };

    this.hbbtvSource.prototype.testSetChannelConstructsCorrectHbbtvChannelObject = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var hbbtvApiSpy = this.sandbox.spy(this.hbbtvPlugin, "createChannelObject");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : function() {
                },
                onError : function() {
                }
            });
            assertTrue("HBBTV createChannelObject function called", hbbtvApiSpy.calledWith(10, 0x233A, 4169, 6009));
        }, config);
    };

    this.hbbtvSource.prototype.testSetChannelCallsHBBTVSetChannelWithCorrectArgs = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var hbbtvApiSpy = this.sandbox.spy(this.hbbtvPlugin, "createChannelObject");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : function() {
                },
                onError : function() {
                }
            });
            assertTrue("HBBTV createChannelObject function called", hbbtvApiSpy.calledWith(10, 0x233A, 4169, 6009));
        }, config);
    };

    this.hbbtvSource.prototype.testSetChannelFallsBackToDVBT = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel.idType = undefined;
            var hbbtvApiSpy = this.sandbox.spy(this.hbbtvPlugin, "createChannelObject");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : function() {
                },
                onError : function() {
                }
            });
            assertTrue("HBBTV createChannelObject function called", hbbtvApiSpy.calledWith(12, 0x233A, 4169, 6009));
        }, config);
    };

    this.hbbtvSource.prototype.testChannelChangeSucceededCallbackIsAdded = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var onSuccessSpy = this.sandbox.spy();
            var onErrorSpy = this.sandbox.spy();

            var listenSpy = this.sandbox.spy(broadcastSource._broadcastVideoObject, 'addEventListener');
            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : onSuccessSpy,
                onError : onErrorSpy
            });

            assertEquals("ChannelChangeSucceeded", listenSpy.getCall(0).args[0]);
        }, config);
    };

    this.hbbtvSource.prototype.testChannelChangeErrorCallbackIsAdded = function(queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var onSuccessSpy = this.sandbox.spy();
            var onErrorSpy = this.sandbox.spy();

            var listenSpy = this.sandbox.spy(broadcastSource._broadcastVideoObject, 'addEventListener');
            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : onSuccessSpy,
                onError : onErrorSpy
            });

            assertEquals("ChannelChangeError", listenSpy.getCall(1).args[0]);
        }, config);
    };

    this.hbbtvSource.prototype.testOnSuccessCallbackIsFiredWhenChannelChangeSucceededEventIsRaised = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var onSuccessSpy = this.sandbox.spy();
            var onErrorSpy = this.sandbox.spy();

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            broadcastSource._broadcastVideoObject.addEventListener("ChannelChangeSucceeded", function() {
                console.log("caught channelchange event on broadasat video object");
                onSuccessSpy();
            });

            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : onSuccessSpy,
                onError : onErrorSpy
            });

            var event = new CustomEvent("ChannelChangeSucceeded", {});
            broadcastSource._broadcastVideoObject.dispatchEvent(event);

            assertTrue("OnSuccess callback function called", onSuccessSpy.called);
            assertTrue("OnError callback function not called", onErrorSpy.notCalled);
        }, config);
    };

    this.hbbtvSource.prototype.testOnErrorCallbackIsFiredWhenChannelChangeErrorEventIsRaised = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var onSuccessSpy = this.sandbox.spy();
            var onErrorSpy = this.sandbox.spy();

            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : onSuccessSpy,
                onError : onErrorSpy
            });

            var e = new CustomEvent('ChannelChangeError');
            broadcastSource._broadcastVideoObject.dispatchEvent(e);

            assertTrue("OnError callback function called", onErrorSpy.called);
            assertTrue("OnSuccess callback function not called", onSuccessSpy.notCalled);
        }, config);
    };

    this.hbbtvSource.prototype.testOnErrorCallbackIsFiredWhenCreateChannelObjectFails = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.createChannelObject = function() {
                return null;
            };
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var onSuccessSpy = this.sandbox.spy();
            var onErrorSpy = this.sandbox.spy();

            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : onSuccessSpy,
                onError : onErrorSpy
            });
            assertTrue("OnError callback function called", onErrorSpy.called);
            assertTrue("OnSuccess callback function not called", onSuccessSpy.notCalled);
        }, config);
    };

    this.hbbtvSource.prototype.testOnErrorCallbackIsFiredIfChannelListCanNotBeAccessed = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.getChannelConfig = undefined;

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var onSuccessSpy = this.sandbox.spy();
            var onErrorSpy = this.sandbox.spy();

            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : onSuccessSpy,
                onError : onErrorSpy
            });
            assertTrue("OnError callback function called", onErrorSpy.called);
            assertTrue("OnSuccess callback function not called", onSuccessSpy.notCalled);
        }, config);
    };

    this.hbbtvSource.prototype.testOnErrorCallbackIsFiredIfChannelListContainsNoChannels = function(queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.getChannelConfig = function() {
                return {
                    channelList : []
                };
            };

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var onSuccessSpy = this.sandbox.spy();
            var onErrorSpy = this.sandbox.spy();

            broadcastSource.setChannel({
                onid : 0x233A,
                tsid : 4169,
                sid  : 6009,
                onSuccess : onSuccessSpy,
                onError : onErrorSpy
            });
            assertTrue("OnError callback function called", onErrorSpy.called);
            assertTrue("OnSuccess callback function not called", onSuccessSpy.notCalled);
        }, config);
    };

    this.hbbtvSource.prototype.testGetChannelListFetchesChannelsFromBroadcastVideoObject = function (queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var getChannelConfigStub = this.sandbox.spy(this.hbbtvPlugin, "getChannelConfig");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: this.sandbox.stub(), onError: this.sandbox.stub()};

            broadcastSource.getChannelList(params);

            assert(getChannelConfigStub.calledOnce);

        }, config);
    };


    this.hbbtvSource.prototype.testGetChannelListCallsErrorCallbackWithMessageWhenFetchingChannelsThrowsException = function (queue) {
        expectAsserts(3);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            this.sandbox.stub(this.hbbtvPlugin, "getChannelConfig").throws({message:"Nope"});
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: this.sandbox.stub(), onError: this.sandbox.stub()};

            broadcastSource.getChannelList(params);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("Nope"));
            assert(params.onSuccess.notCalled);

        }, config);
    };

    this.hbbtvSource.prototype.testGetChannelListCallsErrorCallbackWhenChannelListNotReturned = function (queue) {
        expectAsserts(3);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            this.sandbox.stub(this.hbbtvPlugin, "getChannelConfig").returns({});
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: this.sandbox.stub(), onError: this.sandbox.stub()};

            broadcastSource.getChannelList(params);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("Unable to retrieve channel list"));
            assert(params.onSuccess.notCalled);

        }, config);
    };

    this.hbbtvSource.prototype.testGetChannelListCallsErrorCallbackWhenChannelListIsEmpty = function (queue) {
        expectAsserts(3);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            this.sandbox.stub(this.hbbtvPlugin, "getChannelConfig").returns({channelList: []});
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: this.sandbox.stub(), onError: this.sandbox.stub()};

            broadcastSource.getChannelList(params);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("Channel list contains no channels"));
            assert(params.onSuccess.notCalled);

        }, config);
    };

    this.hbbtvSource.prototype.testGetChannelListCallsOnSuccessWithArrayOfChannelsContainingChannelInformation = function (queue) {
        expectAsserts(16);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/channel'], function(application, Channel) {

            var channels = [
                {
                    name: "One",
                    onid: 123,
                    tsid: 123,
                    sid: 123,
                    channelType: 123
                },
                {
                    name: "Two",
                    onid: 852,
                    tsid: 951,
                    sid: 753,
                    channelType: 963
                }
            ];

            this.sandbox.stub(this.hbbtvPlugin, "getChannelConfig").returns({channelList: channels});
            var channelConstructorSpy = this.sandbox.spy(Channel.prototype, "init");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = { onSuccess: this.sandbox.stub(), onError: this.sandbox.stub()};

            broadcastSource.getChannelList(params);

            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);

            // This is the best way we have for checking the type of the arguments to onSuccess due to the
            // Class.js mixing in the class during construction, rather than using the JavaScript type system.
            var args = params.onSuccess.args[0];
            assertEquals(1,args.length);
            var channelObjects = args[0];
            assert(channelConstructorSpy.calledTwice);
            assertSame(channelConstructorSpy.thisValues[0], channelObjects[0]);
            assertSame(channelConstructorSpy.thisValues[1], channelObjects[1]);

            assertEquals("One", channelObjects[0].name);
            assertEquals(123, channelObjects[0].onid);
            assertEquals(123, channelObjects[0].tsid);
            assertEquals(123, channelObjects[0].sid);
            assertEquals(123, channelObjects[0].type);

            assertEquals("Two", channelObjects[1].name);
            assertEquals(852, channelObjects[1].onid);
            assertEquals(951, channelObjects[1].tsid);
            assertEquals(753, channelObjects[1].sid);
            assertEquals(963, channelObjects[1].type);

        }, config);
    };

    this.hbbtvSource.prototype.testGetCurrentChannelReturnsChannelObjectContainingCurrentChannelInformation = function (queue) {
        expectAsserts(7);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ['antie/devices/broadcastsource/channel'], function(application, Channel) {

            var channelConstructorSpy = this.sandbox.spy(Channel.prototype, "init");
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();
            var channel = broadcastSource.getCurrentChannel();

            assert(channelConstructorSpy.calledOnce);
            assertSame(channelConstructorSpy.thisValues[0], channel);

            assertEquals("BBC One", channel.name);
            assertEquals(123, channel.type);
            assertEquals(321, channel.onid);
            assertEquals(456, channel.tsid);
            assertEquals(654, channel.sid);

        }, config);
    };

    this.hbbtvSource.prototype.testGetCurrentChannelReturnsCorrectIfCurrentChannelIsUndefined = function (queue) {
        expectAsserts(1);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            this.hbbtvPlugin.currentChannel = undefined;
            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            assertFalse(broadcastSource.getCurrentChannel());

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenNameIsNotInChannelListCausesOnError = function (queue) {
        expectAsserts(3);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "NonExistentChannel",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("NonExistentChannel not found in channel list"));


        }, config);
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameCausesOnSuccess = function (queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC One",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameCausesShowOfCurrentChannel = function (queue) {
        expectAsserts(4);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            this.sandbox.stub(application, "getLayout", function() {
                return {
                    requiredScreenSize: { height: 720, width: 1280 }
                };
            });

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            this.hbbtvPlugin.bindToCurrentChannel = this.sandbox.stub();

            var params = {
                channelName: "BBC One",
                onSuccess this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(this.hbbtvPlugin.bindToCurrentChannel.calledOnce);
            assertEquals('1280px', this.hbbtvPlugin.style.width);
            assertEquals('720px', this.hbbtvPlugin.style.height);
            assertEquals('block',this.hbbtvPlugin.style.display);

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameIsDetectedUsingCurrentChannel = function (queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel = {
                name : "BBC Two"
            };

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Two",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToCurrentChannelByNameCallsOnErrorIfCurrentChannelCannotBeDetermined = function (queue) {
        expectAsserts(3);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {
            this.hbbtvPlugin.currentChannel = undefined;

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Two",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("Unable to determine current channel name."));
            assert(params.onSuccess.notCalled);

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameCreatesChannelObjectForNewChannel = function (queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var createChannelObjectStub = this.sandbox.stub(this.hbbtvPlugin, "createChannelObject");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Two",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(createChannelObjectStub.calledOnce);
            assert(createChannelObjectStub.calledWith(8,5,6,7));

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToChannelInChannelListByNameCreatesChannelObjectForNewChannel = function (queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var createChannelObjectStub = this.sandbox.stub(this.hbbtvPlugin, "createChannelObject");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Three",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(createChannelObjectStub.calledOnce);
            assert(createChannelObjectStub.calledWith(12,9,10,11));

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenChannelListIsEmptyCausesOnError = function (queue) {
        expectAsserts(3);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var createChannelObjectStub = this.sandbox.stub(this.hbbtvPlugin, "createChannelObject");
            this.sandbox.stub(this.hbbtvPlugin, "getChannelConfig").returns({channelList:[]});

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Three",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("Channel list contains no channels"));

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenCreateChannelObjectFailsCausesOnError = function (queue) {
        expectAsserts(3);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            this.sandbox.stub(this.hbbtvPlugin, "createChannelObject").returns(null);

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Three",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(params.onSuccess.notCalled);
            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("Channel could not be tuned"));

        }, config);
    };

    this.hbbtvSource.prototype.testTuningToChannelByNameUsesChannelObjectToSetChannel = function (queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var channelObj = { foo: "bar" };

            this.sandbox.stub(this.hbbtvPlugin, "createChannelObject").returns(channelObj);
            var setChannelStub = this.sandbox.stub(this.hbbtvPlugin, "setChannel");

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Three",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            assert(setChannelStub.calledOnce);
            // Use assertSame to ensure the object references are the same! setChannelStub.calledWith({}) only checks equality.
            assertSame(channelObj, setChannelStub.args[0][0]);

        }, config);
    }

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenSetChannelFailsCausesOnError = function (queue) {
        expectAsserts(3);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var channelObj = { foo: "bar" };

            this.sandbox.stub(this.hbbtvPlugin, "createChannelObject").returns(channelObj);

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Three",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            var evt = new CustomEvent('ChannelChangeError');
            broadcastSource._broadcastVideoObject.dispatchEvent(evt);

            assert(params.onError.calledOnce);
            assert(params.onError.calledWith("Error tuning channel"));
            assert(params.onSuccess.notCalled);

        }, config);
    }

    this.hbbtvSource.prototype.testTuningToChannelByNameWhenSetChannelSucceedsCausesOnSuccess = function (queue) {
        expectAsserts(2);

        var config = this.getGenericHBBTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', [], function(application) {

            var channelObj = { foo: "bar" };

            this.sandbox.stub(this.hbbtvPlugin, "createChannelObject").returns(channelObj);

            var device = application.getDevice();
            var broadcastSource = device.createBroadcastSource();

            var params = {
                channelName: "BBC Three",
                onSuccess: this.sandbox.stub(),
                onError: this.sandbox.stub()
            };

            broadcastSource.setChannelByName(params);

            var evt = new CustomEvent('ChannelChangeSucceeded');
            broadcastSource._broadcastVideoObject.dispatchEvent(evt);

            assert(params.onError.notCalled);
            assert(params.onSuccess.calledOnce);

        }, config);
    }

    /*  Helper functions to mock out and use HBBTV specific APIs */

    this.hbbtvSource.prototype.stubHBBTVSpecificApis = function() {
        this.hbbtvPlugin = document.createElement('object');
        var hbbtvPlugin = this.hbbtvPlugin;
        hbbtvPlugin.id = "broadcastVideoObject";
        hbbtvPlugin.bindToCurrentChannel = function() {
        };
        hbbtvPlugin.stop = function() {
        };
        hbbtvPlugin.playState = "hbbTvObjectPlayState";
        hbbtvPlugin.currentChannel = {
            name : "BBC One",
            idType : 10, //DVB-C
            channelType: 123,
            onid: 321,
            tsid: 456,
            sid: 654
        };
        hbbtvPlugin.createChannelObject = function() {
        };
        hbbtvPlugin.setChannel = function() {
        };
        hbbtvPlugin.getChannelConfig = function() {
            return {
                channelList : [
                    {
                        name: "BBC One",
                        onid: 1,
                        tsid: 2,
                        sid: 3,
                        channelType: 4
                    },
                    {
                        name: "BBC Two",
                        onid: 5,
                        tsid: 6,
                        sid: 7,
                        channelType: 8
                    },
                    {
                        name: "BBC Three",
                        onid: 9,
                        tsid: 10,
                        sid: 11,
                        channelType: 12
                    }
                ]
            };
        };

        var target = document.getElementsByTagName('body')[0];
        target.appendChild(hbbtvPlugin);
    };

    this.hbbtvSource.prototype.removeHBBTVSpecificApis = function() {
        var hbbtvPlugin = document.getElementById('broadcastVideoObject');
        if (hbbtvPlugin) { // some tests remove this object before the tear down
            hbbtvPlugin.parentNode.removeChild(hbbtvPlugin);
        }
    };

    this.hbbtvSource.prototype.getGenericHBBTVConfig = function() {
        return {modules:{base:"antie/devices/browserdevice",modifiers:[
            "antie/devices/anim/styletopleft",
            "antie/devices/media/html5",
            "antie/devices/net/default",
            "antie/devices/broadcastsource/hbbtvsource",
            "antie/devices/data/nativejson",
            "antie/devices/storage/cookie",
            "antie/devices/logging/default",
            "antie/devices/exit/closewindow"
        ]},input:{map:{}},layouts:[
            {width:1280,height:720,module:"fixtures/layouts/default",classes:["browserdevice720p"]}
        ],deviceConfigurationKey:"devices-html5-1"};
    };

    onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/broadcastsource/hbbtvsource'], this.hbbtvSource);

})();