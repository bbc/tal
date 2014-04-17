---
layout: default
title: Broadcast Source Playback
---

# Broadcast Source Playback

<p class="lead">The framework can display pictures from broadcast television on devices that support it.</p>

For this functionality to work, the application must be launched with broadcast trust. This can be achieved by launching the application via MHEG or similar.

It is also possible to query information from the TV broadcast - currently the framework's API exposes the friendly name of the current TV channel and, for HbbTV devices, the current play state of the broadcast.

Support for this is currently available in a selection of modern HbbTV, hybrid HbbTV/HTML5 and Samsung devices. Framework device configurations determine whether the functionality is enabled or not.

## Creating a Broadcast Source object

This can be done in a device-agnostic way via the device abstraction layer.

First, obtain a reference to `device`. For instance, to get a reference to the device if you are extending from a `Component`:
{% highlight javascript %}
var device = this.getCurrentApplication().getDevice();
{% endhighlight %}

You can then instantiate a broadcast source player like this:
{% highlight javascript %}
this._broadcastSource = device.createBroadcastSource();
{% endhighlight %}

For devices that do not support playing from Broadcast TV, calling `device.createBroadcastSource()` will *throw an exception*.

`device.createBroadcastSource()` will also throw an exception if the underlying device-specific broadcast API cannot be initialised for any reason.

To check for device support first, before attempting to create the broadcast source object, call the following method which returns a Boolean value:
{% highlight javascript %}
device.isBroadcastSourceSupported()
{% endhighlight %}

This function simply returns true if the broadcast source functionality is enabled; it does not query the device itself.

## Destroying the Broadcast Source object

You must destroy the broadcast source object when you are finished.

Destroy the broadcast source in the example above by calling:
{% highlight javascript %}
this._broadcastSource.destroy()
{% endhighlight %}

## Broadcast Source API

The following API is available on the `_broadcastSource` object.

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `showCurrentChannel()` |N/A | Display the currently tuned channel |
| `stopCurrentChannel()` | N/A | Stops displaying the current tuned channel, displays blank screen |
| `getCurrentChannelName()` | String (or exception) | Returns the friendly name of the current tuned channel. Throws an exception if the channel name cannot be retrieved - details in the exception text. |
| `setChannelByName(params)' | N/A | Takes a parameters object with `channelName` (string), `onError` (function) and `onSuccess` (function) properties. Attempts to tune to the specified channel. |
| `setChannel(params)' | N/A | Takes a parameters object with `onid` (Origninating Newtork ID, number), `tsid` (Transport Stream ID, number) and `sid' (Sevice ID, number), `onError` (function) and `onSuccess` (function) properties. Attempts to tune to the specified channel. |
| `getChannelList(params) | N/A | Takes a parameters object with `onError` (function) and `onSuccess` (function) properties. Attempts to retrieve a list of available channels. |
| `getCurrentChannel() | Object | Attempts to retrieve information about the current channel. |
| `setPosition(top, left, width, height)` | N/A | Set the on-screen position and size of the broadcast. By default, the broadcast fills the screen. |
| `getPlayState()` | Number | Returns current broadcast play state for HbbTV devices:<br/>-1: PLAY_STATE_UNKNOWN; always returned on Samsung devices<br/>0: unrealized; no playback requested yet<br/>1: connecting; tuning, buffering, etc<br/>2: playing<br/>3: stopped |

In addition events may be emitted for various state changes in the broadcast object

| Event | Type | Description |
| ----- | ---- | ----------- |
| `tunerpresenting` | antie.events.TunerPresentingEvent | TODO |
| `tunerstopped` | antie.events.TunerStoppedEvent | TODO |
| `tunerunavailable` | antie.events.TunerUnavailableEvent | TODO |

### Channel tuning ###

TODO

## Broadcast Source Implementations

There are two flavours of broadcast source implementation available:

* HbbTV, and HbbTV/HTML5 hybrid
* Samsung

Each implementation provides the same API.