/**
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
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
    this.ChannelTest = AsyncTestCase("Channel");

    this.ChannelTest.prototype.setUp = function() {
    };

    this.ChannelTest.prototype.tearDown = function() {
    };


    this.ChannelTest.prototype.testNameIsPreservedFromConstructionParameters = function(queue) {
        expectAsserts(4);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals("myChannel", new Channel({"name" : "myChannel"}).name);
            assertEquals("", new Channel({"name" : ""}).name);
            assertUndefined(new Channel({ }).name);
            assertUndefined(new Channel({"name" : undefined}).name);
        });
    };

    this.ChannelTest.prototype.testOnIdIsPreservedFromConstructionParametersWhenTruthy = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals(1234, new Channel({"onid" : 1234}).onid);
        });
    };

    this.ChannelTest.prototype.testOnIdIsUndefinedWhenConstructionParameterOnidIsFalsey = function(queue) {
        expectAsserts(7);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertUndefined(new Channel({"onid" : false}).onid);
            assertUndefined(new Channel({"onid" : null}).onid);
            assertUndefined(new Channel({"onid" : undefined}).onid);
            assertUndefined(new Channel({"onid" : +0}).onid);
            assertUndefined(new Channel({"onid" : -0}).onid);
            assertUndefined(new Channel({"onid" : NaN}).onid);
            assertUndefined(new Channel({"onid" : ""}).onid);
        });
    };

    this.ChannelTest.prototype.testTsidIsPreservedFromConstructionParametersWhenTruthy = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals(1234, new Channel({"tsid" : 1234}).tsid);
        });
    };

    this.ChannelTest.prototype.testTsidIsUndefinedWhenConstructionParameterOnidIsFalsey = function(queue) {
        expectAsserts(7);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertUndefined(new Channel({"tsid" : false}).tsid);
            assertUndefined(new Channel({"tsid" : null}).tsid);
            assertUndefined(new Channel({"tsid" : undefined}).tsid);
            assertUndefined(new Channel({"tsid" : +0}).tsid);
            assertUndefined(new Channel({"tsid" : -0}).tsid);
            assertUndefined(new Channel({"tsid" : NaN}).tsid);
            assertUndefined(new Channel({"tsid" : ""}).tsid);
        });
    };
    this.ChannelTest.prototype.testSidIsPreservedFromConstructionParametersWhenTruthy = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals(1234, new Channel({"sid" : 1234}).sid);
        });
    };

    this.ChannelTest.prototype.testSidIsUndefinedWhenConstructionParameterOnidIsFalsey = function(queue) {
        expectAsserts(7);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertUndefined(new Channel({"sid" : false}).sid);
            assertUndefined(new Channel({"sid" : null}).sid);
            assertUndefined(new Channel({"sid" : undefined}).sid);
            assertUndefined(new Channel({"sid" : +0}).sid);
            assertUndefined(new Channel({"sid" : -0}).sid);
            assertUndefined(new Channel({"sid" : NaN}).sid);
            assertUndefined(new Channel({"sid" : ""}).sid);
        });
    };
    this.ChannelTest.prototype.testPtcIsPreservedFromConstructionParametersWhenTruthy = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals(1234, new Channel({"ptc" : 1234}).ptc);
        });
    };

    this.ChannelTest.prototype.testPtcIsUndefinedWhenConstructionParameterOnidIsFalsey = function(queue) {
        expectAsserts(7);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertUndefined(new Channel({"ptc" : false}).ptc);
            assertUndefined(new Channel({"ptc" : null}).ptc);
            assertUndefined(new Channel({"ptc" : undefined}).ptc);
            assertUndefined(new Channel({"ptc" : +0}).ptc);
            assertUndefined(new Channel({"ptc" : -0}).ptc);
            assertUndefined(new Channel({"ptc" : NaN}).ptc);
            assertUndefined(new Channel({"ptc" : ""}).ptc);
        });
    };
    this.ChannelTest.prototype.testMajorIsPreservedFromConstructionParametersWhenTruthy = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals(1234, new Channel({"major" : 1234}).major);
        });
    };

    this.ChannelTest.prototype.testMajorIsUndefinedWhenConstructionParameterOnidIsFalsey = function(queue) {
        expectAsserts(7);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertUndefined(new Channel({"major" : false}).major);
            assertUndefined(new Channel({"major" : null}).major);
            assertUndefined(new Channel({"major" : undefined}).major);
            assertUndefined(new Channel({"major" : +0}).major);
            assertUndefined(new Channel({"major" : -0}).major);
            assertUndefined(new Channel({"major" : NaN}).major);
            assertUndefined(new Channel({"major" : ""}).major);
        });
    };
    this.ChannelTest.prototype.testMinorIsPreservedFromConstructionParametersWhenTruthy = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals(1234, new Channel({"minor" : 1234}).minor);
        });
    };

    this.ChannelTest.prototype.testMinorIsUndefinedWhenConstructionParameterOnidIsFalsey = function(queue) {
        expectAsserts(7);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertUndefined(new Channel({"minor" : false}).minor);
            assertUndefined(new Channel({"minor" : null}).minor);
            assertUndefined(new Channel({"minor" : undefined}).minor);
            assertUndefined(new Channel({"minor" : +0}).minor);
            assertUndefined(new Channel({"minor" : -0}).minor);
            assertUndefined(new Channel({"minor" : NaN}).minor);
            assertUndefined(new Channel({"minor" : ""}).minor);
        });
    };
    this.ChannelTest.prototype.testSourceIdIsPreservedFromConstructionParametersWhenTruthy = function(queue) {
        expectAsserts(1);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals(1234, new Channel({"sourceId" : 1234}).sourceId);
        });
    };

    this.ChannelTest.prototype.testSourceIdIsUndefinedWhenConstructionParameterOnidIsFalsey = function(queue) {
        expectAsserts(7);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertUndefined(new Channel({"sourceId" : false}).sourceId);
            assertUndefined(new Channel({"sourceId" : null}).sourceId);
            assertUndefined(new Channel({"sourceId" : undefined}).sourceId);
            assertUndefined(new Channel({"sourceId" : +0}).sourceId);
            assertUndefined(new Channel({"sourceId" : -0}).sourceId);
            assertUndefined(new Channel({"sourceId" : NaN}).sourceId);
            assertUndefined(new Channel({"sourceId" : ""}).sourceId);
        });
    };

    this.ChannelTest.prototype.testTypeIsPreservedFromConstructionParameters = function(queue) {
        expectAsserts(4);

        queuedRequire(queue, ["antie/devices/broadcastsource/channel"], function(Channel) {

            assertEquals(1234, new Channel({"idType" : 1234}).idType);
            assertEquals(0, new Channel({"idType" : 0}).idType);
            assertUndefined(new Channel({"idType" : undefined}).idType);
            assertUndefined(new Channel({ }).idType);
        });
    };



})();
