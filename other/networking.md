---
layout: default
title: Networking
---
# Networking

<p class="lead">The device abstraction layer provides networking methods to make asynchronous network requests.</p>

Same origin GET requests (where the resource being fetched is on the same host as the application) are straightforward. Due to [browser security](http://en.wikipedia.org/wiki/Same_origin_policy), cross-domain GETs and POSTs place certain requirements on the backend and on the device.


<div class="alert alert-info">
        <p><strong>Note</strong> you will need to obtain a reference to the device abstraction layer in order to use the networking methods:</p>
        <ol>
            <li>Include the RunTime context in your require.js dependancies: <code>"antie/runtimecontext"</code></li>
            <li>Get a reference to the device: <code>device = RuntimeContext.getDevice();</code></li>
        </ol>
</div>


## Performing a Same Origin GET Request

To perform a GET request to the same origin as the application, obtain a reference to the device, then use the `loadUrl()` function:
{% highlight javascript %}
device.loadURL(url, {
        onLoad: function(responseText) {
        },
        onError: function(responseText) {
        }
});
{% endhighlight %}

## Performing a Same Origin Authenticated GET Request

To perform a GET request to a resource protected by client authentication, you can use the `loadAuthenticatedURL(...)` function:
{% highlight javascript %}
device.loadAuthenticatedURL(url, {
        onLoad: function(responseText) {
        },
        onError: function(responseText) {
        }
});
{% endhighlight %}

This will use any device-specific method required to load the authenticated URL (for example using a SSL/TLS client-certificate).

## Performing a Cross-Domain GET Request

Your server-side application should be configured to provide JSON data via [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) (with a MIME type of `application/json`), but also be capable of providing [JSONP](http://en.wikipedia.org/wiki/JSONP) for devices where CORS is not supported.

The framework uses device configuration files to determine whether a device supports CORS. It does not perform feature sniffing. For details of how to specify CORS support for a device, see below.

### Server Requirements for Cross-Domain GET Requests

* CORS: Supports the `OPTIONS` HTTP method
* CORS: Understands CORS pre-flight requests via the `OPTIONS` method and sends the `Access-Control-Allow-Origin` header in response - [see this article for more details](http://www.html5rocks.com/en/tutorials/cors/#toc-types-of-cors-requests)
* CORS: Responds to the CORS pre-flight request with HTTP status 200
* JSONP: The server-side application honours a `?callback=<name>` query string parameter, which wraps the returned JSON in a JavaScript function callback of `<name>`

### Cross-Domain GET Request via CORS

A cross-domain GET request can be made as follows:
{% highlight javascript %}
device.executeCrossDomainGet(url, {
        onSuccess: function(responseObject) {
        },
        onError: function(response) {
        }
});
{% endhighlight %}

On devices that support CORS, this will GET data from `url` and parse it from JSON to a JavaScript object before calling your `onSuccess` callback with the result.

On devices that do not support CORS, TAL will add a callback parameter to the URL (e.g. `?callback=antie_callback`) before making the request. The remote server is expected to use this parameter and wrap the returned JSON in the named callback method to produce a JSONP response. Your `onSuccess` callback will receive the result.

The fallback JSONP behaviour can be configured via the optional third argument on `executeCrossDomainGet()`. The argument is a JavaScript object with the following properties, all of which have sensible defaults:
* timeout (in ms. Default: 5000)
* id (name of the callback function to use in the JSONP response. Default: random string)
* callbackKey (name of the `callback` parameter to pass in the HTTP query string. Default: callback)

### Cross-Domain GET Request via JSONP

You can use a JSONP request to fetch data, which does not attempt to use CORS. A JSONP request can be made as follows:

{% highlight javascript %}
device.loadScript(url, /%callback%/, {
        onSuccess: function(responseObject) {
        },
        onError: function(response) {
        }
});
{% endhighlight %}

For example:

{% highlight javascript %}
device.loadScript("http://www.other.domain/resource?callback=%callback%", /%callback%/, {
        onSuccess: function(responseObject) {
        },
        onError: function(response) {
        }
});
{% endhighlight %}

The regular expression passed as the 2nd argument (`/%callback%/`) is used to replace the matching part of the URL.

You may also pass an optional timeout (in ms) as the 4th argument. The `onError` callback (with the parameter 'timeout') will be executed if a response is not received within the given time.

## Performing a Cross-Domain POST

Your backend application should be configured to accept data and supply a response via CORS. It should also support the [window.name transport method](http://www.sitepen.com/blog/2008/07/22/windowname-transport/) for receiving POSTs and returning a response to devices that lack CORS support.

Note that the window.name transport method is essentially a hack exploiting a browser security hole. As such, it may not work on more modern browser engines.

### Server-side Requirements for Cross-Domain POSTs

* CORS: Supports the `OPTIONS` HTTP method
* CORS: Understands CORS pre-flight requests via the `OPTIONS` method and sends the `Access-Control-Allow-Origin` header in response - [see this article](http://www.html5rocks.com/en/tutorials/cors/#toc-types-of-cors-requests) for more details
* CORS: Responds to the CORS pre-flight request with HTTP status 200
* CORS: Accepts JSON payload with `application/json` MIME type
* window.name fallback: Accept form POST (`application/x-www-form-urlencoded`) with single field containing JSON-encoded request payload (the field name is arbitrary)
* window.name fallback: Server-side application sets `window.name` property on an iframe to the response payload (JSON-encoded)
* window.name fallback: Server-side application redirects the iframe back to a URL on your client application's origin after setting the `window.name` property
* window.name fallback: [More details here](http://www.sitepen.com/blog/2008/07/22/windowname-transport/)

### Cross-Domain POST - with CORS

The signature for performing a cross-domain POST is:
{% highlight javascript %}
device.executeCrossDomainPost(url, data, options)
{% endhighlight %}

An example of usage is:

{% highlight javascript %}
device.executeCrossDomainPost(url,
        {
                "postKey1": "postValue1",
                "postKey2": "postValue2",
                "postKey3": "postValue3"
        },
        {
                onLoad: function(responseText) {
                },
                onError: function(ex) {
                },
                fieldName: "payload"
        }
);
{% endhighlight %}

This will package up the `data` as JSON and POST it via CORS with a Content-Type of `application/json`.

If the device is configured as not supporting CORS, the JSON payload will be delivered via the window.name transport method, as a single form field named by the `fieldName` property in the `options` argument. Your server endpoint must therefore accept JSON-encoded data in either form, unless you know every target device will support CORS.

### Cross-Domain POST - window.name transport method

You can use the window.name transport method directly if you know your target devices will never support CORS. However, this approach is deprecated. Use it by calling the `crossDomainPost(...)` function:
{% highlight javascript %}
device.crossDomainPost(url,
        {
                "postKey1": "postValue1",
                "postKey2": "postValue2",
                "postKey3": "postValue3"
        },
        {
                onLoad: function(responseText) {
                },
                onError: function(ex) {
                }
        }
);
{% endhighlight %}

By default this function will initially load a 'blank.html' page within the same directory as the application. You can point this to an alternate location using:
{% highlight javascript %}
device.crossDomainPost(url,
        {
                "postKey1": "postValue1",
                "postKey2": "postValue2",
                "postKey3": "postValue3"
        },
        {
                onLoad: function(responseText) {
                },
                onError: function(ex) {
                },
                blankUrl: "/path/to/blankpage"
        }
});
{% endhighlight %}

The `blankUrl` should always be on the same origin as the application, so it is best to pass a relative URL without scheme, host and port.

This approach relies on the service you're POSTing to setting the response text into the window.name property of an iframe, then redirecting back to a URL on the application's origin.

## Enabling CORS Support for a Device

Whether the device supports CORS or not is controlled by the `supportsCORS` configuration value in the `networking` section of the device configuration. Set this to `true` to indicate that CORS is supported. Note that the framework takes no steps to verify that this is correct.

For example, for a device that supports both JSONP and CORS:

{% highlight javascript %}
"networking": {
        "supportsJSONP": true
        "supportsCORS": true
    }
{% endhighlight %}

The `supportsJSONP` configuration value is not used by TAL, but you may find it useful in your applications.
