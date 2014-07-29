/**
 * @fileOverview Requirejs modifier for default XHR-based network operations
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
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
					if (xhr.status === 200) {
						if (opts.onLoad) {
							opts.onLoad(xhr.responseText);
						}
					} else {
						if (opts.onError) {
							opts.onError(xhr.responseText);
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
