---
layout: default
title: Storage
---
# Storage

<p class="lead">The framework provides an abstracted notion of storage. Both session and persistent storage providers are available with a common API that allows you to maintain a key-object store.</p>

## Obtaining a Storage Provider

You can obtain a storage provider via the device abstraction layer.

To obtain a storage provider, [get a reference to the device](/tal/faq.html#question-how-do-i-get-a-refernce-the-device-abstraction-layer-in-the-code) and then call `device.getStorage(...)`, e.g, to obtain session storage, call:
{% highlight javascript %}
var storage = device.getStorage(StorageProvider.STORAGE_TYPE_SESSION, namespace);
{% endhighlight %}
or to obtain persistent storage, call:
{% highlight javascript %}
var storage = device.getStorage(StorageProvider.STORAGE_TYPE_PERSISTENT, namespace);
{% endhighlight %}

The namespace is the storage namespace you wish to use. It is recommended that you use your application name - this prevents applications from affecting others running on the device.

## Storing a Value

One you've obtained a storage provider, you may call the `setItem(...)` method to store an object:
{% highlight javascript %}
storage.setItem(key, value);
{% endhighlight %}

Any previous item with the same key will be overwritten.

*Note:* The object must be JSON persistable i.e. contain no methods, or cyclic references.

## Retrieving a Value

You can receive a previously stored value using:
{% highlight javascript %}
var value = storage.getItem(key);
{% endhighlight %}

## Removing a Value

If you no-longer require a value, it is recommended that you remove it. Storage space is limited on many devices (see [Limitations](#Limitations)), so clearing up after yourself is important. You can remove a value using:
{% highlight javascript %}
storage.removeItem(key);
{% endhighlight %}

## Clearing a Namespace

If you want to remove all data stored within a namespace, you can call the clear method, e.g.:
{% highlight javascript %}
storage.clear();
{% endhighlight %}

## Limitations

As the storage implementation varies on a device-by-device basis you must cater for the lowest specification target device. Many devices use HTTP Cookies for storage, and therefore have a maximum limit of 4KB per namespace (each namespace is stored as a separate cookie).

The framework does not at present enforce this limit, so it is up to you to be conservative when persisting data.

As cookies or other non-encrypted storage mechanisms may be used, it is important that you do not store personal information in cookies. There are encryption libraries available for JavaScript which you can use to encrypt the data you store. In most cases you are likely to only need to store hashes, in which case the framework provides an [SHA-1](https://github.com/fmtvp/tal/blob/master/static/script/lib/sha1.js) and [seedable secure pseudorandom number generator](https://github.com/fmtvp/tal/blob/master/static/script/lib/math.seedrandom.js). Please remember to salt any hashes.
