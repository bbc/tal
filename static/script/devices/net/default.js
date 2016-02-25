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

define(
    'antie/devices/net/default',
    ['antie/devices/browserdevice'],
    function (Device) {
        'use strict';

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
        Device.prototype.loadScript = function (url, callbackFunctionRegExp, callbacks, timeout, callbackSuffix) {
            var self = this;
            var script = null;
            var funcName = '_antie_callback_' + (callbackSuffix || ((new Date() * 1) + '_' + Math.floor(Math.random() * 10000000)));

            if (window[funcName]) {
                throw 'A request with the name ' + funcName + ' is already in flight';
            }

            var timeoutHandle = window.setTimeout(function () {
                if (window[funcName]) {
                    if (script) {
                        self.removeElement(script);
                    }
                    delete window[funcName];
                    if (callbacks && callbacks.onError) {
                        callbacks.onError('timeout');
                    }
                }
            }, timeout || 5000);

            window[funcName] = function (obj) {
                if (timeout) {
                    window.clearTimeout(timeoutHandle);
                }
                if (callbacks && callbacks.onSuccess) {
                    callbacks.onSuccess(obj);
                }
                self.removeElement(script);
                delete window[funcName];
            };

            script = this._createElement('script');
            script.src = url.replace(callbackFunctionRegExp, funcName);
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(script);
            return script;
        };

        /**
         * Loads a resource from a URL protected by device authentication.
         * @param {String} url The URL to load.
         * @param {Object} opts Object containing onLoad and onError callback functions.
         * @returns The request object used to load the resource.
         */
        Device.prototype.loadAuthenticatedURL = function (url, opts) {
            // Simple implementation - assuming XHR in browser can perform client-authenticated SSL requests
            return this.loadURL(url, opts);
        };
        /**
         * Loads a resource from a URL.
         * @param {String} url The URL to load.
         * @param {Object} opts Object containing onLoad and onError callback functions.
         * @returns The request object used to load the resource.
         */
        Device.prototype.loadURL = function (url, opts) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState === 4) {
                    this.onreadystatechange = null;
                    if (this.status >= 200 && this.status < 300) {
                        if (opts.onLoad) {
                            opts.onLoad(this.responseText, this.status);
                        }
                    } else {
                        if (opts.onError) {
                            opts.onError(this.responseText, this.status);
                        }
                    }
                }
            };

            try {
                xhr.open(opts.method || 'GET', url, true);
                if (opts && opts.headers) {
                    for (var header in opts.headers) {
                        if(opts.headers.hasOwnProperty(header)) {
                            xhr.setRequestHeader(header, opts.headers[header]);
                        }
                    }
                }
                xhr.send(opts.data || null);
            } catch (ex) {
                if (opts.onError) {
                    opts.onError(ex);
                }
            }
            return xhr;
        };
        /**
         * Performs a POST HTTP request to a URL on a different host/domain.
         * @param {String} url The URL to post to.
         * @param {Object} data Associative array of fields/values to post.
         * @param {Object} opts Object containing onLoad and onError callback functions.
         */
        Device.prototype.crossDomainPost = function (url, data, opts) {
            var iframe, form;
            var postRequestHasBeenSent = false;
            var blankPageToLoad = opts.blankUrl || 'blank.html';
            var timeoutHandle;

            function iframeLoadTimeoutCallback() {
                iframe.onload = null;
                if (opts.onError) {
                    opts.onError('timeout');
                }
            }

            function iframeLoadedCallback() {
                var urlLoadedIntoInvisibleIFrame, errorGettingIFrameLocation;
                try {
                    urlLoadedIntoInvisibleIFrame = iframe.contentWindow.location.href;
                } catch (exception) {
                    errorGettingIFrameLocation = exception;
                }

                if (errorGettingIFrameLocation || !urlLoadedIntoInvisibleIFrame) {
                    // we didn't load the page - give the browser a second chance to load the iframe
                    setTimeout(function () {
                        iframe.src = blankPageToLoad + '#2';
                    }, 500);
                    return;
                }

                if (postRequestHasBeenSent === false) {
                    postRequestHasBeenSent = true;

                    createForm();
                    for (var name in data) {
                        if(data.hasOwnProperty(name)){
                            createField(name, data[name]);
                        }
                    }
                    form.submit();
                } else {
                    if (timeoutHandle) {
                        clearTimeout(timeoutHandle);
                    }

                    iframe.onload = null;
                    try {
                        var responseData = iframe.contentWindow.name;
                        iframe.parentNode.removeChild(iframe);
                        if (opts.onLoad) {
                            opts.onLoad(responseData);
                        }
                    } catch (exception) {
                        if (opts.onError) {
                            opts.onError(exception);
                        }
                    }
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
                var input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
            }

            function createIframe() {
                iframe = document.createElement('iframe');
                iframe.style.width = '0';
                iframe.style.height = '0';
                iframe.src = blankPageToLoad + '#1';
                iframe.onload = iframeLoadedCallback;
                document.body.appendChild(iframe);
            }

            timeoutHandle = setTimeout(iframeLoadTimeoutCallback, (opts.timeout || 10) * 1000);
            /* 10 second default */
            createIframe();
        };

        /**
         * Performs a cross domain GET for a decoded JSON object utilising CORS if supported by
         * the device, falling back to a JSON-P call otherwise.
         * @param {String} url The URL to load. A callback GET parameter will be appended if JSON-P is used.
         * @param {Object} opts Object containing callbacks and an optional bearer token.
         * @param {Function} [opts.onSuccess] Will be called with the decoded JSON object if the call is successful.
         * @param {Function} [opts.onError] Will be called with error text, and HTTP status for CORS requests, if the calls fails.
         * @param {String} [opts.bearerToken] Used when making requests for resources that require authentication.
         * For CORS requests, the token is used as a Bearer token in an Authorization header (see RFC 6750, section 2.1), and for
         * JSON-P requests the token is included as a query string parameter. If not specified, no token is included in the request.
         * @param {Object} [jsonpOptions] Options for the JSON-P fallback behaviour. All optional with sensible defaults.
         * @param {Number} [jsonpOptions.timeout=5000] Timeout for the JSON-P call in ms. Default: 5000.
         * @param {String} [jsonpOptions.id] Used in the callback function name for the JSON-P call. Default: a random string.
         * @param {String} [jsonpOptions.callbackKey=callback] Key to use in query string when passing callback function name
         * for JSON-P call. Default: callback
         */
        Device.prototype.executeCrossDomainGet = function (url, opts, jsonpOptions) {
            var self, callbackKey, callbackQuery, modifiedOpts;
            self = this;
            jsonpOptions = jsonpOptions || {};
            if (configSupportsCORS(this.getConfig())) {
                modifiedOpts = {
                    onLoad: function (jsonResponse) {
                        opts.onSuccess(self.decodeJson(jsonResponse));
                    },
                    onError: opts.onError
                };

                if (opts.bearerToken) {
                    modifiedOpts.headers = {
                        Authorization: 'Bearer ' + opts.bearerToken
                    };
                }

                this.loadURL(url, modifiedOpts);
            } else {
                callbackKey = jsonpOptions.callbackKey || 'callback';
                callbackQuery = '?' + callbackKey + '=%callback%';
                if (url.indexOf('?') === -1) {
                    url = url + callbackQuery;
                } else {
                    url = url.replace('?', callbackQuery + '&');
                }

                if (opts.bearerToken) {
                    url = url + '&bearerToken=' + opts.bearerToken;
                }

                this.loadScript(url, /%callback%/, opts, jsonpOptions.timeout, jsonpOptions.id);
            }
        };

        /**
         * Performs a cross domain POST HTTP using CORS or the content delivered as a single form field value depending on device capability
         * @param {String} url The URL to post to.
         * @param {Object} data JavaScript object to be JSON encoded and delivered as payload.
         * @param {Object} opts Object containing callback functions, a form field name and an optional bearer token.
         * @param {String} opts.fieldName Name to be used for the POST form field for form based (non-CORS) requests.
         * @param {Function} [opts.onLoad] Will be called with the decoded JSON response if the POST is successful.
         * @param {Function} [opts.onError} Will be called with error text or an Exception object if the POST fails.
         * @param {String} [opts.bearerToken] Used when making POST requests for resources that require authentication. For
         * CORS requests, the token is used as a Bearer token in an Authorization header (see RFC 6750, section 2.1), and
         * for form requests the token is included as a bearerToken form field value. If not specified, no token is included
         * in the request.
         */
        Device.prototype.executeCrossDomainPost = function (url, data, opts) {
            var payload, modifiedOpts, formData;
            payload = this.encodeJson(data);
            if (configSupportsCORS(this.getConfig())) {
                modifiedOpts = {
                    onLoad: opts.onLoad,
                    onError: opts.onError,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: payload,
                    method: 'POST'
                };

                if (opts.bearerToken) {
                    modifiedOpts.headers.Authorization = 'Bearer ' + opts.bearerToken;
                }

                this.loadURL(url, modifiedOpts);
            } else {
                formData = {};
                formData[opts.fieldName] = payload;

                if (opts.bearerToken) {
                    formData.bearerToken = opts.bearerToken;
                }

                this.crossDomainPost(url, formData, {
                    onLoad: opts.onLoad,
                    onError: opts.onError,
                    blankUrl: opts.blankUrl
                });
            }
        };

        function configSupportsCORS(config) {
            return config && config.networking && config.networking.supportsCORS;
        }
    }
);
