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

The following API is available on the BroadcastSource object.

| Method | Returns | Description |
| ------ | ------- | ----------- |
| `showCurrentChannel()` |N/A | Display the currently tuned channel |
| `stopCurrentChannel()` | N/A | Stops the currently playing programme and turns the screen black |
| `getCurrentChannelName()` | String (or exception) | Get the current channel name from broadcast and return as a string. |
| `getChannelNameList(params)` | N/A | Get the list of currently available channels names. The params object takes `onError` (function) and `onSuccess` (function) properties.|
| `setPosition(top, left, width, height)` | N/A | Set the on-screen position and size of the broadcast. By default, the broadcast fills the screen. |
| `getState()` | Number | Indicates the current state of the broadcast source:<br/>-1: PLAY_STATE_UNKNOWN; always returned on Samsung devices<br/>0: unrealized; no playback requested yet<br/>1: connecting; tuning, buffering, etc<br/>2: playing<br/>3: stopped |
| `setChannelByName(params)` | N/A | Takes a parameters object with `channelName` (string), `onError` (function) and `onSuccess` (function) properties. Attempts to tune to the specified channel. |
| `setChannel(params)` | N/A | Takes a parameters object with `onid` (Original Network ID, number), `tsid` (Transport Stream ID, number) and `sid` (Service ID, number), `onError` (function) and `onSuccess` (function) properties. Attempts to tune to the specified channel. |
| `destroy()` | N/A | Reverts the current screen settings and performs any clean up required before the user exits the application back to standard broadcast. |

In addition events may be emitted for various state changes in the broadcast object. These are sent to every widget
currently within the application's widget tree, starting at the application's root widget and working down. The event
can be prevented from being run on further widgets by using the event's `stopPropagation()` call. Having events sent to
every widget within a complex application may not be performant, so listening for these events on the root widget and
stopping propagation may be appropriate.

| Event | Type | Description |
| ----- | ---- | ----------- |
| `tunerpresenting` | antie.events.TunerPresentingEvent | Indicates broadcast has started playing. Has a property, `channel`, containing information about the current playing channel. |
| `tunerstopped` | antie.events.TunerStoppedEvent | Indicates broadcast has stopped playing. |
| `tunerunavailable` | antie.events.TunerUnavailableEvent | Indicates broadcast has been interrupted, for example because the broadcast signal has stopped. (e.g. the antenna has been removed from the device.) |

### Channel tuning ###

Changing a channel within an application requires an appropriate AIT (Application Information Table) set-up, otherwise
the device should exit the application on channel change. Details of the AIT, whether in the broadcast signal, or as an
external AITX (AIT XML) file, are beyond the scope of this document.

At a low level, there are three things required to change channel, sometimes known as the DVB triplet. These are the
ONID (Original Network ID), TSID (Transport Stream ID) and SID (Service ID). Dependent on the broadcast infrastructure
it is possible for these to vary by region even for a single channel. While it is therefore possible to tune via the
DVB triplet using the `setChannel` call, it is possible that you will not know the full triplet in advance.

The `setChannelByName` call works at a slightly higher level, taking the name of the channel (as held in the broadcast
signal and displayed on the EPG) and determining the required tuning information from the device.

## Broadcast Source Implementations

There are two flavours of broadcast source implementation available:

* HbbTV, and HbbTV/HTML5 hybrid
* Samsung

Each implementation provides the same API.
