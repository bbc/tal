/*
 * @fileOverview	Requirejs module containing the class for the destroyApplication exit strategy.
 * 					If following the OIPF spec, devices should do the same on a call to window.close()
 * 					as when using Application.destroyApplication, so this exit strategy is ONLY
 * 					necessary when a device does not follow the spec.
 * 					Otherwise, use the closewindow strategy. It's much simpler.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
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

require.def(
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
        }
    }
);
