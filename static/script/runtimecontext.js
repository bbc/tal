/**
 * @fileOverview Requirejs module containing the antie.RunTimeContext class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/runtimecontext',
    [
        'antie/class'
    ],
    /**
     * Static class for accessing the current running application
     * @name antie.RuntimeContext
     * @class
     * @static
     * @private
     */
    function(Class) {
        'use strict';

        var applicationObject;

        var RuntimeContext = Class.extend(/** @lends antie.RuntimeContext.prototype */ {
            /**
             * Clears the currently executing application.
             * @private
             */
            clearCurrentApplication: function clearCurrentApplication () {
                applicationObject = undefined;
            },

            /**
             * Sets the currently executing application.
             * @private
             */
            setCurrentApplication: function setCurrentApplication (app) {
                if (applicationObject) {
                    throw new Error('RuntimeContext.setCurrentApplication called for a second time. You can only have one application instance running at any time.');
                } else {
                    applicationObject = app;
                }
            },

            /**
             * Returns the currently executing application.
             * @private
             */
            getCurrentApplication: function getCurrentApplication () {
                return applicationObject;
            },

            /**
             * Returns the current device
             * @private
             */
            getDevice: function getDevice () {
                return this.getCurrentApplication().getDevice();
            }
        });

        return new RuntimeContext();
    }
);
