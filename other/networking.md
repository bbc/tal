---
layout: default
title: Networking
---
# Networking

<p class="lead">The device abstraction layer provides networking methods to make asynchronous network requests.</p>

## Performing a GET Request

To perform a GET request to the same origin as the application, obtain a reference to the device, then use the `loadUrl()` function:
{% highlight javascript %}
device.loadURL(url, {
        onLoad: function(responseText) {
        },
        onError: function(responseText) {
        }
});
{% endhighlight %}

## Performing a Cross-Domain GET Request

If you wish to perform a GET request to a different origin (hostname/port) than where the application is running, fetching JSON-encoded data that will be parsed by your application, you have two choices:
* Make use of [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing) for the request, falling back to [JSON-P](http://en.wikipedia.org/wiki/JSONP) on devices where CORS is not supported
* Rely on JSON-P only. Most supported devices do not support [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing), so this may be the safest option.

The framework uses device configuration files to determine whether a device supports CORS. It does not perform feature sniffing. For details of how to specify CORS support for a device, see below.

### Cross-Domain GET Request via CORS

A cross-domain CORS request can be made as follows:
{% highlight javascript %}
device.executeCrossDomainGet(url, {
        onSuccess: function(responseObject) {
        },
        onError: function(response) {
        }
});
{% endhighlight %}

On devices that support CORS, this will GET data from `url` and parse it from JSON to a JavaScript object before calling your `onSuccess` callback with the result.

On devices that do not support CORS, TAL will add a callback parameter to the URL (e.g. `?callback=antie_callback`) before making the request. The remote server is expected to use this parameter and wrap the returned JSON in the named callback method to produce a JSON-P response.

The fallback JSON-P behaviour can be configured via the optional third argument on `executeCrossDomainGet()`. See the inline documentation on `device.js` for more details.

### Cross-Domain GET Request via JSON-P

A JSON-P request can be made as follows:

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

## Performing an Authenticated GET Request

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

## Performing a Cross-Domain POST

As with cross-domain GET requests, you can attempt to use CORS, falling back to the non-CORS approach if the device doesn't support it, or just go straight for the non-CORS approach.

### Cross-Domain POST - with CORS

For devices that support CORS, the signature for performing a cross-domain POST is:
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

If the device is configured as not supporting CORS, the JSON payload will be delivered via the window.name transport method (see below), as a single form field named by the `fieldName` property in the `options` argument. Your server endpoint must therefore accept JSON-encoded data in either form, unless you know every target device will support CORS.

### Cross-Domain POST - without CORS

As devices do not generally support CORS, the [window.name transport method](http://www.sitepen.com/blog/2008/07/22/windowname-transport/) of performing cross-domain POST requests is used. This relies on the service you're POSTing to setting the response text into the window.name property of an iframe, then redirecting back to a URL on the application's origin.

To perform a cross-domain POST you can use the `crossDomainPost(...)` function:
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

The `blankUrl` should always be on the same origin as the application, so it is best to pass an absolute URL without scheme, host and port.

## Enabling CORS Support for a Device

Whether the device supports CORS or not is controlled by the `supportsCORS` configuration value in the `networking` section of the device configuration. Set this to `true` to indicate that CORS is supported. Note that the framework takes no steps to verify that this is correct.

For example, for a device that supports both JSON-P and CORS:

{% highlight javascript %}
"networking": {
        "supportsJSONP": true
        "supportsCORS": true
    }
{% endhighlight %}

The `supportsJSONP` configuration value is not used by TAL, but you may find it useful in your applications.
