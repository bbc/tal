/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

(function () {
    this.LivePlayerSupportLevelNoneTest = AsyncTestCase('LivePlayerSupportLevelNoneTest');

    this.LivePlayerSupportLevelNoneTest.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
    };

    this.LivePlayerSupportLevelNoneTest.prototype.tearDown = function () {
        this.sandbox.restore();
    };

    this.LivePlayerSupportLevelNoneTest.prototype.testGetLivePlayerReturnsNullWithSupportLevelNone = function (queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/devices/device', 'antie/devices/mediaplayer/live/none'], function (Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var mediaPlayer = device.getLivePlayer();

            assertEquals(null, mediaPlayer);
        });
    };

    this.LivePlayerSupportLevelNoneTest.prototype.testGetLiveSuppoertReturnsNoneWithSupportLevelNone = function (queue) {
        expectAsserts(1);

        queuedRequire(queue, ['antie/devices/device', 'antie/devices/mediaplayer/live/none'], function (Device) {

            var device = new Device(antie.framework.deviceConfiguration);
            var liveSupportLevel = device.getLiveSupport();

            assertEquals('none', liveSupportLevel);
        });
    };

})();
