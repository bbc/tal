/**
 * @fileOverview Requirejs module containing the antie.events.NetworkStatusChangeEvent class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/events/networkstatuschangeevent',
    ['antie/events/event'],
    function(Event) {
        'use strict';

        /**
         * Class of events raised when the network state of a device changes (e.g. it goes offline).
         * @name antie.events.NetworkStatusChangeEvent
         * @class
         * @extends antie.events.Event
         * @param {Integer} networkStatus The new network status.
         */
        var NetworkStatusChangeEvent = Event.extend(/** @lends antie.events.FocusEvent.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (networkStatus) {
                this.networkStatus = networkStatus;
                init.base.call(this, 'networkstatuschange');
            }
        });

        /**
         * Device is offline.
         * @memberOf antie.events.NetworkStatusChangeEvent
         * @name NETWORK_STATUS_OFFLINE
         * @constant
         * @static
         */
        NetworkStatusChangeEvent.NETWORK_STATUS_OFFLINE = 0;

        /**
         * Device is online.
         * @memberOf antie.events.NetworkStatusChangeEvent
         * @name NETWORK_STATUS_ONLINE
         * @constant
         * @static
         */
        NetworkStatusChangeEvent.NETWORK_STATUS_ONLINE = 1;

        return NetworkStatusChangeEvent;
    }
);
