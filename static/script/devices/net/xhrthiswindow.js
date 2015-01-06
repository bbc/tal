/**
 * @fileOverview Requirejs modifier for default XHR-based network operations
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
	'antie/devices/net/xhrthiswindow',
	[
		'antie/devices/browserdevice'
	],
	function (Device) {
		'use strict';

		/**
		 * Loads a resource from a URL.
         * This for devices where the activation object (i.e. 'this') within an event listener on an XMLHttpRequest instance
         * is a reference to the window object, not the XMLHttpRequest instance.
		 * @param {String} url The URL to load.
		 * @param {Object} opts Object containing onLoad and onError callback functions.
		 * @returns The request object used to load the resource.
		 */
		Device.prototype.loadURL = function (url, opts) {
			var xhr = new XMLHttpRequest();
			xhr.open(opts.method || 'GET', url, true);
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					xhr.onreadystatechange = null;
					if (xhr.status >= 200 && xhr.status < 300) {
						if (opts.onLoad) {
							opts.onLoad(xhr.responseText, xhr.status);
						}
					} else {
						if (opts.onError) {
							opts.onError(xhr.responseText, xhr.status);
						}
					}
				}
			};
			if (opts && opts.headers) {
				for (var header in opts.headers) {
					if (opts.headers.hasOwnProperty(header)) {
						xhr.setRequestHeader(header, opts.headers[header]);
					}
				}
			}
			try {
				xhr.send(opts.data || null);
			} catch (ex) {
				if (opts.onError) {
					opts.onError(ex);
				}
			}
			return xhr;
		};
	}
);
