/**
 * @fileOverview Requirejs modifier containing animation implementation to disable all animation
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/anim/noanim',
    [
        'antie/devices/browserdevice',
        'antie/devices/anim/shared/transitionendpoints'
    ],
    function(Device, TransitionEndPoints) {
        'use strict';

        /* documented in antie.devices.Device */
        Device.prototype.scrollElementTo = function(options) {
            if(new RegExp('_mask$').test(options.el.id)) {
                if (options.el.childNodes.length === 0) {
                    return null;
                }
                options.el.style.position = 'relative';
                options.el = options.el.childNodes[0];
                options.el.style.position = 'relative';
            } else {
                return null;
            }
            var startLeft = Math.abs(options.el.style.left.replace(/px/, '')) || 0;
            var changeLeft = (options.to.left !== undefined) ? (options.to.left - startLeft) : 0;
            var startTop = Math.abs(options.el.style.top.replace(/px/, '')) || 0;
            var changeTop = (options.to.top !== undefined) ? (options.to.top - startTop) : 0;
            if ((changeLeft === 0) && (changeTop === 0)) {
                if (options.onComplete) {
                    options.onComplete();
                }
                return null;
            }

            if (options.to.left !== undefined) {
                options.el.style.left = 0 - options.to.left + 'px';
            }
            if (options.to.top !== undefined) {
                options.el.style.top = 0 - options.to.top + 'px';
            }
            if (options.onComplete) {
                options.onComplete();
            }

            return null;
        };

        /* documented in antie.devices.Device */
        Device.prototype.moveElementTo = function(options) {
            // Performance consideration: if left or top is null they are ignored to prevent the additional
            // work animating them.

            var startLeft = parseInt(options.el.style.left.replace(/px|em|pt/,'')) || 0;
            var changeLeft = (options.to.left !== undefined) ? (options.to.left - startLeft) : 0;
            var startTop = parseInt(options.el.style.top.replace(/px|em|pt/,'')) || 0;
            var changeTop = (options.to.top !== undefined) ? (options.to.top - startTop) : 0;

            if ((changeLeft === 0) && (changeTop === 0)) {
                if (options.onComplete) {
                    options.onComplete();
                }
                return null;
            }

            if (options.to.left !== undefined) {
                options.el.style.left = options.to.left + 'px';
            }
            if (options.to.top !== undefined) {
                options.el.style.top = options.to.top + 'px';
            }
            if (options.onComplete) {
                options.onComplete();
            }
        };

        /* documented in antie.devices.device */
        Device.prototype.hideElement = function(options) {
            options.el.style.visibility = 'hidden';
            options.el.style.opacity = 0;
            if (typeof options.onComplete === 'function') {
                options.onComplete();
            }
        };

        /* documented in antie.devices.device */
        Device.prototype.showElement = function(options) {
            options.el.style.visibility = 'visible';
            options.el.style.opacity = 1;
            if (typeof options.onComplete === 'function') {
                options.onComplete();
            }
        };

        Device.prototype.tweenElementStyle = function(options) {
            var transEndPoints, i, prop, properties, elStyle;
            elStyle = options.el.style;

            transEndPoints = new TransitionEndPoints(
                {
                    to: options.to,
                    from: options.from,
                    units: options.units
                }
            );

            properties = transEndPoints.getProperties();

            for (i = 0; i !== properties.length; i += 1){
                prop = properties[i];
                elStyle[prop] =  transEndPoints.getPropertyDestination(prop);
            }
            if (typeof options.onComplete === 'function') {
                options.onComplete();
            }
        };

        /* documented in antie.devices.device */
        Device.prototype.stopAnimation = function() {
            // Left intentionally blank
        };

        /* documented in antie.devices.device */
        Device.prototype.isAnimationDisabled = function(){
            return true;
        };
    }
);
