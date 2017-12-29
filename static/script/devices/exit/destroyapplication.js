/**
 * @fileOverview    Requirejs module containing the class for the destroyApplication exit strategy.
 *                  If following the OIPF spec, devices should do the same on a call to window.close()
 *                  as when using Application.destroyApplication, so this exit strategy is ONLY
 *                  necessary when a device does not follow the spec.
 *                  Otherwise, use the closewindow strategy. It's much simpler.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/exit/destroyapplication',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        // MIME type for the OIPF application manager, as defined by the spec (v1.2)
        // Spec: http://www.oipf.tv/specifications/root/volume-5-declarative-application-environment-r112/download
        var APPMANAGER_MIME_TYPE = 'application/oipfApplicationManager';

        /**
         * Exits the application by invoking Application.destroyApplication()
         * after getting the OIPF application manager. In theory, according to
         * the spec, this has the same effect as calling window.close().
         */
        Device.prototype.exit = function() {
            var factory = window.oipfObjectFactory;

            // Check that the OIPF factory is implemented and supports the application manager
            if(factory && factory.isObjectSupported(APPMANAGER_MIME_TYPE)) {
                var appManager = factory.createApplicationManagerObject();

                if(appManager) {
                    // Ask the application manager for an Application object for this app
                    var ownerApp = appManager.getOwnerApplication(window.document);

                    if(ownerApp) {
                        // Destroy this app and finish
                        ownerApp.destroyApplication();
                    }
                }
            }
        };
    }
);
