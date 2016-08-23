define(
    'antie/devices/anim/css3transform',
    [
        'antie/devices/browserdevice'
    ],
    function (Device) {
        'use strict';

        function skipAnim (options, device) {
            return device.getConfig().animationDisabled || options.skipAnim;
        }

        Device.prototype.moveElementTo = function (options) {
            options.el.classList.add('animate--transform');
        };
    }
);
