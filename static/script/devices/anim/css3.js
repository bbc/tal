/**
 * @fileOverview Requirejs modifier for CSS3-based animations.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/anim/css3',
    [
        'antie/devices/browserdevice',
        'antie/devices/anim/css3/transition',
        'antie/devices/anim/css3/optionstransitiondefinition',
        'antie/devices/anim/shared/transitionendpoints',
        'antie/devices/anim/shared/animationhandle'
    ],
    function(Device,  Transition, OptionsTransitionDefinition, TransitionEndPoints, AnimationHandle) {
        'use strict';

        function shouldSkipAnim(options, device) {
            return device.getConfig().animationDisabled || options.skipAnim;
        }

        function getConfig(propertyName, device) {
            if(device.getConfig().defaults) {
                return device.getConfig().defaults[propertyName];
            }
            return undefined;
        }

        function animationHandle(trans){
            return new AnimationHandle( function(gotoEnd){
                trans.stop(gotoEnd);
            });
        }

        /* documented in antie.devices.Device */
        Device.prototype.scrollElementTo = function(options) {
            var transEndPoints, trans, self;
            self = this;

            if(new RegExp('_mask$').test(options.el.id)) {
                if(options.el.childNodes.length === 0)  {
                    return null;
                }
                options.el.style.position = 'relative';
                options.el = options.el.childNodes[0];
                options.el.style.position = 'relative';
            } else {
                return null;
            }

            transEndPoints = new TransitionEndPoints(

                {
                    to: {
                        left: -options.to.left,
                        top: -options.to.top
                    },
                    from: options.from,
                    units: options.units,
                    onComplete: options.onComplete,
                    skipAnim: shouldSkipAnim(options, self)
                }
            );

            trans = new Transition(
                new OptionsTransitionDefinition(options),
                transEndPoints,
                options.el
            );

            return animationHandle(trans);
        };

        /* documented in antie.devices.Device */
        Device.prototype.moveElementTo = function(options) {
            var trans, transEndPoints;

            transEndPoints = new TransitionEndPoints(
                {
                    to: options.to,
                    from: options.from,
                    units: options.units,
                    onComplete: options.onComplete,
                    skipAnim: shouldSkipAnim(options, this)
                }
            );

            if(transEndPoints.hasProperty('top') || transEndPoints.hasProperty('left')) {
                trans = new Transition(
                    new OptionsTransitionDefinition(options),
                    transEndPoints,
                    options.el
                );
            }

            return animationHandle(trans);
        };

        /* documented in antie.devices.device */
        Device.prototype.showElement = function(options) {
            var transDef, transEndPoints, transOpts, config, trans;
            config = getConfig('showElementFade', this);
            transOpts = {
                to: {
                    opacity: 1,
                    visibility: 'visible'
                },
                from: {
                    opacity: 0,
                    visibility: 'hidden'
                },
                duration: options.duration,
                onComplete: options.onComplete,
                skipAnim: shouldSkipAnim(options, this)
            };

            transDef = new OptionsTransitionDefinition(transOpts, config);
            transDef.setPropertyDuration('visibility', 0);
            transEndPoints = new TransitionEndPoints(transOpts);

            trans = new Transition(
                transDef,
                transEndPoints,
                options.el
            );
            return animationHandle(trans);
        };

        /* documented in antie.devices.device - easing and fps not yet implemented here */
        Device.prototype.hideElement = function(options) {
            var transDef, transEndPoints, transOpts, config, trans;
            config = getConfig('hideElementFade', this);
            transOpts = {
                to: {
                    opacity: 0,
                    visibility: 'hidden'
                },
                from: {
                    opacity: 1,
                    visibility: 'visible'
                },
                duration: options.duration,
                onComplete: options.onComplete,
                skipAnim: shouldSkipAnim(options, this)
            };

            transDef = new OptionsTransitionDefinition(transOpts, config);
            transDef.setPropertyDelay('visibility', transDef.getPropertyDuration('opacity'));
            transEndPoints = new TransitionEndPoints(transOpts);

            trans = new Transition(
                transDef,
                transEndPoints,
                options.el
            );

            return animationHandle(trans);
        };

        Device.prototype.tweenElementStyle = function(options) {
            var transDef, transEndPoints;
            transDef = new OptionsTransitionDefinition(options, {});

            transEndPoints = new TransitionEndPoints(
                {
                    to: options.to,
                    from: options.from,
                    units: options.units,
                    onComplete: options.onComplete,
                    skipAnim: shouldSkipAnim(options, this)
                }
            );

            return animationHandle(new Transition(
                transDef,
                transEndPoints,
                options.el
            ));
        };

        /* documented in antie.devices.device */
        Device.prototype.isAnimationDisabled = function(){
            return false;
        };

        /**
          * @deprecated just call stop on the animation handle itself
          */
        Device.prototype.stopAnimation = function(animHandle) {
            animHandle.stop(true);
        };
    }
);
