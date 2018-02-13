/**
 * @fileOverview Requirejs module containing base antie.devices.bradcastsource.basetvsource class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/broadcastsource/basetvsource',
    [
        'antie/class'
    ],
    function (Class) {
        'use strict';

        /**
         * Contains an abstract implementation of the antie base broadcast TV source.
         * @class
         * @name antie.devices.broadcastsource.BaseTVSource
         * @extends antie.Class
         * @protected
         */

        var BaseTvSource = Class.extend(/** @lends antie.devices.broadcastsource.BaseTVSource.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init () {
                throw new Error('Abstract class constructor should not be called directly');
            },
            /**
             * Displays the currently tuned channel
             */
            showCurrentChannel: function showCurrentChannel () {
                throw new Error('Device broadcast source does not override abstract method showCurrentChannel');
            },
            /**
             * Stops the currently playing programme and turns the screen black
             */
            stopCurrentChannel: function stopCurrentChannel () {
                throw new Error('Device broadcast source does not override abstract method stopCurrentChannel');
            },
            /**
             * Get the current channel name from broadcast and return as a string.
             * @returns A string with the name of the current channel.
             */
            getCurrentChannelName: function getCurrentChannelName () {
                throw new Error('Device broadcast source does not override abstract method getCurrentChannelName');
            },
            /**
             * Get the list of currently available channels names.
             * @param params.onSuccess function called if the channel list is retrieved, passed a single argument which is a list of Channel objects.
             * @param params.onError function called if retrieving the channel list fails.
             * @returns an array of strings, each representing an available channel
             */
            getChannelNameList : function (/*params*/) {
                throw new Error('Device broadcast source does not override abstract method getChannelList');
            },
            /**
             * Sets the size and position of the visible broadcast source
             * @param top

             * @param left
             * @param width
             * @param height
             */
            setPosition : function(/*top, left, width, height*/) {
                throw new Error('Device broadcast source does not override abstract method setPosition');
            },
        /**
              * Indicates the current state of the broadcast source
              * @returns {antie.devices.broadcastsources.BaseTvSource.STATE} current state of the broadcast source
              */
            getState : function() {
                throw new Error('Device broadcast source does not override abstract method getState');
            },
            /**
             * Requests the device switches a tuner to the channel specified by the channel name.
             * @param params.channelName String representation of the channel name as it appears in the EPG.
             * @param params.onSuccess function to be called if the tuner was retuned successfully
             * @param params.onError function to be called if the provided channel was unable to be tuned
             */
            setChannelByName : function(/*params*/) {
                throw new Error('Device broadcast source does not override abstract method setChannelByName');
            },
            /**
             * Reverts the current screen settings and performs any clean up required before
             * the user exits the application back to standard broadcast.
             */
            destroy : function() {
                throw new Error('Device broadcast source does not override abstract method destroy');
            }
        });

        /**
         * An enumeration of possible tuner states.
         * @name antie.devices.broadcastsource.BaseTvSource.STATE
         * @enum {String}
         */
        BaseTvSource.STATE = {
            UNKNOWN: 'UNKNOWN', // tuner state not known
            UNAVAILABLE: 'UNAVAILABLE', // No tuner available
            CONNECTING: 'CONNECTING', // tuner attempting to connect
            PRESENTING: 'PRESENTING', // tuner is presenting a channel
            STOPPED: 'STOPPED' // tuner is stopped
        };

        return BaseTvSource;
    }
);
