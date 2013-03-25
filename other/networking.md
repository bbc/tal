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

If you wish to perform a GET request to a different origin (hostname/port) than where the application is running, you must make use of JSON-P, rather than a normal XMLHTTPRequest GET request. Most supported devices do not support [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing), so we advise against relying on this.

A JSON-P request can be made as follows:

{% highlight javascript %}
device.loadScript(url, /%callback%/, {
        onLoad: function(responseObject) {
        },
        onError: function(response) {
        }
});
{% endhighlight %}

For example:

{% highlight javascript %}
device.loadScript("http://www.other.domain/resource?callback=%callback%", /%callback%/, {
        onLoad: function(responseObject) {
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

## Performing a Cross-Domain POST Request

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