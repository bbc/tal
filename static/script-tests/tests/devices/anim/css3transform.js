require(
    [
        'antie/devices/browserdevice',
        'antie/devices/anim/css3transform' // adds methods to Device.prototype
    ],
    function (BrowserDevice) {
        'use strict';

        var device = new BrowserDevice(antie.framework.deviceConfiguration);

        describe('CSS3 Transform Animations', function () {
            it('indicates animation is not disabled', function () {
                expect(device.isAnimationDisabled()).toBe(false);
            });
        });
    }
);