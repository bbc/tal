---
layout: default
title: Media Playback (Deprecated)
---
# Media Playback (Deprecated)

> This has been replaced by the [Media Playback (Improved)](../overview/new-media-playback.html) from TAL 2.1.7 onwards, offering improved media playback across devices.

The framework abstracts device specific media players to a common API based on the html5 MediaElement.

## Creating a video player

This can be done in a device-agnostic way through the application's device object.

If you are extending from `Application`, the device object is available via `getDevice()`
{% highlight javascript %}
var device = this.getDevice();
{% endhighlight %}

If you are extending `Widget` or its subclasses:
{% highlight javascript %}
var device = this.getCurrentApplication().getDevice();
{% endhighlight %}

You can then instantiate a video player:
{% highlight javascript %}
this._videoPlayer = device.createPlayer("testPlayer", "video");
{% endhighlight %}

The `_videoPlayer` object this gives you is of type `Media`

## Setting the video source

You can set video sources via the setSources() method:
It takes an array of one or more MediaSource objects.

MediaSource objects are constructed with a url and mime type

{% highlight javascript %}
this._videoPlayer.setSources([
    new MediaSource("http://my.madeupvideo.com/somevid.mp4", "video/mp4")
]);
{% endhighlight %}

## Loading video

Once you have set the source, the load method will ask the device to request data.
{% highlight javascript %}
this._videoPlayer.load();
{% endhighlight %}

## Playing video

The play() method will attempt to play the video.

{% highlight javascript %}
this._videoPlayer.play();
{% endhighlight %}

One way to use these methods is to attempt preload and wait for the video to be ready before calling `play()`.
The 'canplay' event is fired on `_videoPlayer` when it is able to play video.

{% highlight javascript %}
var self = this;

this._videoPlayer.addEventListener("canplay", function() {
    self._videoPlayer.play();
});
{% endhighlight %}

### Hiding the background

Some devices always composite html on top of video playback, so if you use any sort of non-transparent background, playback will not be visible.

If this is the case, you will need to remove the background just before playback, then restore on stop.

One way to do this is via a `background-none` css class:

{% highlight css %}
.background-none {
    background-image: none !important;
    background-color: transparent !important;
}
{% endhighlight %}

You can check to see if a device requires this and apply the style using

{% highlight javascript %}
if (device.getPlayerEmbedMode() === Media.EMBED_MODE_BACKGROUND) {
    device.addClassToElement(document.body, 'background-none');
    application.getRootWidget().addClass('background-none');
}
player.play();
{% endhighlight %}

Similarly, to show the background again

{% highlight javascript %}
if (this._device.getPlayerEmbedMode() === Media.EMBED_MODE_BACKGROUND) {
    this._device.removeClassFromElement(document.body, 'background-none');
    this._application.getRootWidget().removeClass('background-none');
}
{% endhighlight %}

## Stopping a video

To interrupt playback you can call:
{% highlight javascript %}
this._videoPlayer.pause();
{% endhighlight %}

If you want to close down the video player completely, for example if you are navigating to a different component, you should call

{% highlight javascript %}
this._videoPlayer.destroy();
{% endhighlight %}

## Media events

These are all the lifecycle events fired by a media player that client applications can listen for.

| Event | Description |
| ----- | ----------- |
| `loadstart` | The user agent begins looking for media data, as part of the resource selection algorithm.    networkState equals NETWORK_LOADING |
| `progress` | The user agent is fetching media data.     networkState equals NETWORK_LOADING |
| `suspend` | The user agent is intentionally not currently fetching media data, but does not have the entire media resource downloaded.  networkState equals NETWORK_IDLE |
| `abort` | The user agent stops fetching the media data before it is completely downloaded, but not due to an error.     error is an object with the code MEDIA_ERR_ABORTED. networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted. |
| `error` | An error occurs while fetching the media data.    error is an object with the code MEDIA_ERR_NETWORK or higher. networkState equals either NETWORK_EMPTY or NETWORK_IDLE, depending on when the download was aborted. |
| `emptied` | A media element whose networkState was previously not in the NETWORK_EMPTY state has just switched to that state (either because of a fatal error during load that's about to be reported, or because the load() method was invoked while the resource selection algorithm was already running).    networkState is NETWORK_EMPTY; all the IDL attributes are in their initial states. |
| `stalled` | The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.     networkState is NETWORK_LOADING. |
| `play` | Playback has begun. Fired after the play() method has returned, or when the autoplay attribute has caused playback to begin.   paused is newly false. |
| `pause` | Playback has been paused. Fired after the pause() method has returned.    paused is newly true. |
| `loadedmetadata` | The user agent has just determined the duration and dimensions of the media resource and the timed tracks are ready.     readyState is newly equal to HAVE_METADATA or greater for the first time. |
| `loadeddata` | The user agent can render the media data at the current playback position for the first time.    readyState newly increased to HAVE_CURRENT_DATA or greater for the first time. |
| `waiting` | Playback has stopped because the next frame is not available, but the user agent expects that frame to become available in due course.  readyState is newly equal to or less than HAVE_CURRENT_DATA, and paused is false. Either seeking is true, or the current playback position is not contained in any of the ranges in buffered. It is possible for playback to stop for two other reasons without paused being false, but those two reasons do not fire this event: maybe playback ended, or playback stopped due to errors. |
| `playing` | Playback has started.   readyState is newly equal to or greater than HAVE_FUTURE_DATA, paused is false, seeking is false, or the current playback position is contained in one of the ranges in buffered. |
| `canplay` | The user agent can resume playback of the media data, but estimates that if playback were to be started now, the media resource could not be rendered at the current playback rate up to its end without having to stop for further buffering of content.   readyState newly increased to HAVE_FUTURE_DATA or greater. |
| `canplaythrough` | The user agent estimates that if playback were to be started now, the media resource could be rendered at the current playback rate all the way to its end without having to stop for further buffering.     readyState is newly equal to HAVE_ENOUGH_DATA. |
| `seeking` | The seeking IDL attribute changed to true and the seek operation is taking long enough that the user agent has time to fire the event. |
| `seeked` | The seeking IDL attribute changed to false. |
| `timeupdate` | The current playback position changed as part of normal playback or in an especially interesting way, for example discontinuously. |
| `ended` | Playback has stopped because the end of the media resource was reached.   currentTime equals the end of the media resource; ended is true. |
| `ratechange` | Either the defaultPlaybackRate or the playbackRate attribute has just been updated. |
| `durationchange` | The duration attribute has just been updated. |
| `volumechange` | Either the volume attribute or the muted attribute has changed. Fired after the relevant attribute's setter has returned. |
