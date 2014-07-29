/**
 * @fileOverview Requirejs modifier for default XHR-based network operations
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */
require.def(
	'antie/devices/net/default',
	['antie/devices/browserdevice'],
	function(Device) {
		/**
		 * Loads an external script that calls a specified callback function.
		 * Used for loading data via JSON-P.
		 * @param {String} url The URL of the script.
		 * @param {RegExp} callbackFunctionRegExp Regular expression to replace matches with callback function name.
		 * @param {Object} callbacks Object containing onSuccess and onLoad callback functions.
		 * @param {Integer} timeout Timeout in milliseconds.
		 * @param {String} [callbackSuffix] Suffix to append to end of callback function name.
		 * @returns The script element that will load the script.
		 */
		Device.prototype.loadScript = function(url, callbackFunctionRegExp, callbacks, timeout, callbackSuffix) {
			var script = null;
			var funcName = "_antie_callback_" + (callbackSuffix || ((new Date() * 1) + "_" + Math.floor(Math.random() * 10000000)));

			var timeoutHandle = window.setTimeout(function() {
				if (window[funcName]) {
					delete window[funcName];
					if (script) {
						this.removeElement(script);
					}
					if (callbacks && callbacks.onError) {
						callbacks.onError('timeout');
					}
				}
			}, timeout || 5000);

			window[funcName] = function(obj) {
				if (timeout) {
					window.clearTimeout(timeoutHandle);
				}
				delete window[funcName];
				if (callbacks && callbacks.onSuccess) {
					callbacks.onSuccess(obj);
				}
			};

			var el = this._createElement("script");
			el.src = url.replace(callbackFunctionRegExp, funcName);
			var head = document.getElementsByTagName("head")[0];
			head.appendChild(el);
			return el;
		},
		/**
		 * Loads a resource from a URL protected by device authentication.
		 * @param {String} url The URL to load.
		 * @param {Object} opts Object containing onLoad and onError callback functions.
		 * @returns The request object used to load the resource.
		 */
		Device.prototype.loadAuthenticatedURL = function(url, opts) {
			// Simple implementation - assuming XHR in browser can perform client-authenticated SSL requests
			return this.loadURL(url, opts);
		},
		/**
		 * Loads a resource from a URL.
		 * @param {String} url The URL to load.
		 * @param {Object} opts Object containing onLoad and onError callback functions.
		 * @returns The request object used to load the resource.
		 */
		Device.prototype.loadURL = function(url, opts) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			xhr.onreadystatechange = function() {
				if (this.readyState == 4) {
					this.onreadystatechange = null;
					if (this.status == 200) {
						if (opts.onLoad) {
							opts.onLoad(this.responseText);
						}
					} else {
						if (opts.onError) {
							opts.onError(this.responseText);
						}
					}
				}
			};
			if (opts && opts.headers) {
				for (var header in opts.headers) {
					xhr.setRequestHeader(header, opts.headers[header]);
				}
			}

			try {
				xhr.send(null);
			} catch(ex) {
				if (opts.onError) {
					opts.onError(ex);
				}
			}
			return xhr;
		},
		/**
		 * Performs a POST HTTP request to a URL on a different host/domain.
		 * @param {String} url The URL to post to.
		 * @param {Object} data Associative array of fields/values to post.
		 * @param {Object} opts Object containing onLoad and onError callback functions.
		 */
		Device.prototype.crossDomainPost = function(url, data, opts) {
			var iframe, form, timeoutHandle;
			var blank = opts.blankUrl || "blank.html";
			var blank1 = blank + "#1";
			var blank2 = blank + "#2";

			function timeout() {
				iframe.onload = null;
				if (opts.onError) opts.onError("timeout");
			}

			function callback() {
				var href, err;
				try {
					href = iframe.contentWindow.location.href;
				} catch (ex) {
					err = ex;
				}

				if (new RegExp(blank1).test(href)) {
					createForm();
					for (var name in data) {
						createField(name, data[name]);
					}
					form.submit();
				} else if (new RegExp(blank2).test(href)) {
					if (timeoutHandle) {
						window.clearTimeout(timeoutHandle);
						timeoutHandle = null;
					}
					iframe.onload = null;
					try {
						var responseData = iframe.contentWindow.name;
						iframe.parentNode.removeChild(iframe);
						if (opts.onLoad) opts.onLoad(responseData);
					} catch (ex) {
						if (opts.onError) opts.onError(ex);
					}
				} else if (err || !href) {
					setTimeout(function() {
						iframe.src = blank2;
					}, 500);
				}

			}

			function createForm() {
				var doc = iframe.contentWindow.document;
				form = doc.createElement('form');
				form.method = 'POST';
				form.action = url;
				doc.body.appendChild(form);
			}

			function createField(name, value) {
				var doc = iframe.contentWindow.document;
				var input = doc.createElement('input');
				input.type = "hidden";
				input.name = name;
				input.value = value;
				form.appendChild(input);
			}

			function createIframe() {
				iframe = document.createElement('iframe');
				iframe.style.width = "0";
				iframe.style.height = "0";
				iframe.src = blank1;
				iframe.onload = callback;
				document.body.appendChild(iframe);
			}

			setTimeout(timeout, (opts.timeout || 10) * 1000);
			/* 10 second default */
			createIframe();
		};
	}
);

