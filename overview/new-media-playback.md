---
layout: default
title: Media Playback (improved)
---
# Media Playback (improved)

TAL provides an device-agnostic [media playback API via the `MediaPlayer`](/tal/jsdoc/symbols/antie.devices.mediaplayer.MediaPlayer.html) class. This can be used to play video and audio files supported by the device.

> This deprecates the [old media playback API](../widgets/media-playback.html) from TAL 2.1.7 onwards, offering improved media playback across devices.

The framework only supports the the playback of one item of media at a time.
Video can be only be played in full screen.

## Accessing the media playback API

You will need to use the [correct media player modifier](device-configuration.html) in the device's configuration file.

Access the media player through the application's `Device` object.:

{% highlight javascript %}
this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
{% endhighlight %}

For example, creating a component to playback media:

{% highlight javascript %}
require.def(
    "exampleapp/appui/components/examplemediaplayer",
    [
        "antie/widgets/component",
        "antie/runtimecontext",
        "antie/devices/mediaplayer/mediaplayer"
    ],
    function(Component, RuntimeContext, MediaPlayer) {
        var ExampleMediaPlayer = Component.extend({
            init : function() {
                this._super("ExampleMediaPlayer");
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
            }
        });
    return ExampleMediaPlayer;  
});        
{% endhighlight %}

## Playback States

The MediaPlayer has a number of playback states:

{% highlight javascript %}
MediaPlayer.STATE = {
    EMPTY:      "EMPTY",     // No source set
    STOPPED:    "STOPPED",   // Source set but no playback
    BUFFERING:  "BUFFERING", // Not enough data to play, waiting to download more
    PLAYING:    "PLAYING",   // Media is playing
    PAUSED:     "PAUSED",    // Media is paused
    COMPLETE:   "COMPLETE",  // Media has reached its end point
    ERROR:      "ERROR"      // An error occurred
};
{% endhighlight %}

The media playback state changes as API methods are called. Different API methods have different effects depending on the playback state. Transitions to the `STOPPED` and `ERROR` state have been limited in the state diagram below for clarity. Transitions occur synchronously in response to API methods, except those marked by an asterisk (*) which result from asynchronous behaviour such as buffering or at the end of media.
 
![MediaPlayer playback states](/tal/img/overview/new_media_states.png)

The playback state can be accessed using `getState()`.

#### In state `EMPTY`
* On entry to state: clear source url
* Call `setSource(url)` : store the url and transition to `STOPPED`
* Call `playFrom(), beginPlayback(), beginPlaybackFrom(), pause(), resume() or stop()`: transition to `ERROR`

#### In state `STOPPED`
* On entry to state: Cancel all playback and fire event type `MediaPlayer.EVENT.STOPPED`
* Call `beginPlaybackFrom(time)` : request playback from 'time' (clamped to the available range), transition to `BUFFERING`
* Call `reset()` : transition to `EMPTY`
* Call `beginPlayback()` : begin playback from wherever the device can (could be anywhere for Live, usually media start for VOD), transition to `BUFFERING`
* Call `setSource(), playFrom() pause(), resume() or stop()`: transition to `ERROR`
* Device metadata/start-buffering/finish-buffering : stay in `STOPPED`
* On network error : transition to `ERROR`

#### In state `BUFFERING`
* On entry to state: fire event type `MediaPlayer.EVENT.BUFFERING`
* Call `playFrom(time)`: seek to time (clamped to the available range), and remember to resume playback and transition to `PLAYING` when sufficient data is available
* Call `stop()` : transition to `STOPPED`
* Call `pause()` : When buffering is complete, remember to pause playback and transition to `PAUSED` when sufficient data is available
* Call `resume()` : When buffering is complete, remember to resume playback and transition to `PLAYING` when sufficient data is available
* Call `beginPlayback(), beginPlaybackFrom(), reset() or setSource()`: transition to `ERROR`
* If sufficient data is available for playback, transition to either `PLAYING` or `PAUSED` as required
* If the implementation can determine the duration before it's ready to play, then it should fire event type `MediaPlayer.EVENT.STATUS`
* On network/playback error : transition to `ERROR`

#### In state `PLAYING`
* On entry to state: fire event type `MediaPlayer.EVENT.PLAYING`
* Call `pause()` : pause playback and transition to PAUSED
* Call `playFrom(time)` : seek to time (clamped to the available range) and transition to BUFFERING
* Call `stop()` : transition to `STOPPED`
* Call `resume()` : do nothing
* Call `beginPlayback(), beginPlaybackFrom(), reset() or setSource`: transition to `ERROR`
* On playback/network error: transition to `ERROR`
* At regular intervals (< 1s): fire `MediaPlayer.EVENT.STATUS`
* On media completion: transition to `COMPLETE`
* If buffering starts, transition to `BUFFERING`

#### In state `PAUSED`
* On entry to state: fire event type `MediaPlayer.EVENT.PAUSED`
* Call `resume()` : resume playback from current time and transition to `PLAYING`
* Call `playFrom(time)`: seek to time (clamped to the available range) and transition to `BUFFERING`
* Call `stop()` : transition to `STOPPED`
* Call `pause()` : do nothing
* Call `beginPlayback(), beginPlaybackFrom(), reset() or setSource()`: transition to `ERROR`

#### In state `COMPLETE`
* On entry to state: fire event type `MediaPlayer.EVENT.COMPLETE`
* Call `stop()` : transition to `STOPPED`
* Call `playFrom(time)`: seek to time (clamped to the available range) and transition to `BUFFERING`
* Call `beginPlayback(), beginPlaybackFrom(), reset(), setSource(), pause() or resume()` : transition to `ERROR`
* Device metadata/start-buffering/finish-buffering : stay in `COMPLETE`
* On network/playback error : stay in `COMPLETE`

#### In state `ERROR`
* On entry to state: fire event type `MediaPlayer.EVENT.ERROR`
* Call `reset()` : transition to `EMPTY`
* Call `setSource(), beginPlayback(), beginPlaybackFrom(), pause(), resume(), stop() or playFrom()` : transition to `ERROR`
* Device metadata/start-buffering/finish-buffering : stay in `ERROR`

## Setting the media (audio or video) source

To set the source of the media, the MediaPlayer must be in the `EMPTY` state.
You can set the media source by using the `setSource()` method.
It takes a mediaType (`MediaPlayer.TYPE.VIDEO` or `MediaPlayer.TYPE.AUDIO`), a url and the mimeType of the file.

For example, to load a video:

{% highlight javascript %}
this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "http://example.com/video.mp4","video/mp4");
{% endhighlight %}

If setting the source is successful, the playback state will change to `STOPPED` and an event will be emitted of type `MediaPlayer.EVENT.STOPPED`.

From the `STOPPED` state, `MediaPlayer` can be used to access the properties of the media source (`getSource()`, `getMimeType()`, `getMimeType()`);

To change the media source, applications must ensure the MediaPlayer is in the `STOPPED` state and call `reset()` to transition to the `EMPTY` state before calling `setSource()` with a different URL.

## Playing and seeking through media

The `beginPlaybackFrom(seconds)` method will attempt to play the media from the provided time (in seconds).

For example, to play media from the start: 

{% highlight javascript %}
this._mediaPlayer.beginPlaybackFrom(0);
{% endhighlight %}

This will cause the playback state to change to `BUFFERING` and an event emitted of type `MediaPlayer.EVENT.BUFFERING`.

`beginPlayback()` can also be used. This is sometimes useful when `beginPlaybackFrom(seconds)` fails to work because it cannot determine the duration of the media, for example, on a live stream.

When the device has loaded enough of the video to begin playback, the MediaPlayer will transition to the `PLAYING` state and an event of type `MediaPlayer.EVENT.PLAYING` emitted.

The device may be connected to a slow network connection, meaning the rate of video download is slower than the playback speed.
When this occurs, the MediaPlayer will enter the `BUFFERING` state asynchronously and an event emitted of type `MediaPlayer.EVENT.BUFFERING` (as above).
By [adding an event callback](#media-playback-events) to listen to these events, you can update your application's interface to, for example, show a buffering spinner.

`playFrom(seconds)` can be used to seek to different points in the media. If the seconds parameter is larger than the duration of the media, the value will be clamped and playback will begin from just before the end. Requests to seek within one second of the current time will be ignored to ensure consistent behaviour across devices.

## Hiding the background

Some devices always composite html on top of video playback, so if you use any sort of non-transparent background, playback will not be visible.

If this is the case, you will need to remove the background just before playback, then restore on stop.

One way to do this is via a `background-none` css class:

{% highlight css %}
.background-none {
    background-image: none !important;
    background-color: transparent !important;
}
{% endhighlight %}

{% highlight javascript %}
_removeBackground: function () {
    if (this._haveRemovedBackground === undefined &&
     this._mediaType !== MediaPlayer.TYPE.AUDIO) {
        var application = this.getCurrentApplication();
        var device = application.getDevice();
        device.addClassToElement(document.body, 'background-none');
        application.getRootWidget().addClass('background-none');
        this._haveRemovedBackground = true;
    }
},

_restoreBackground: function () {
    var application = this.getCurrentApplication();
    var device = application.getDevice();
    device.removeClassFromElement(document.body, 'background-none');
    application.getRootWidget().removeClass('background-none');
    this._haveRemovedBackground = undefined;
}
{% endhighlight %}

## Stopping media

To interrupt playback you can call:
{% highlight javascript %}
this._mediaPlayer.pause();
{% endhighlight %}

The MediaPlayer will transition to the `PAUSED` state. From this state you can choose to resume playback:
{% highlight javascript %}
this._mediaPlayer.resume();
{% endhighlight %}

If you want to close down the video player completely, for example if you are navigating to a different component, you should call

{% highlight javascript %}
this._mediaPlayer.stop();
{% endhighlight %}

This will transition the MediaPlayer to the `STOPPED` state.

## Media playback events

MediaPlayer will emit events to notify the application of changes in the playback state.

To listen for these events in your application, use the `addEventCallback()` method.

{% highlight javascript %}
this._mediaPlayer.addEventCallback(this, function(event) {
    //handle events here, e.g. by switching on using event.type
});
{% endhighlight %}

The `event` object has the following properties: `{ type, currentTime, range, url, mimeType, state}` where `type` is a string specified in the `MediaPlayer.EVENT` enum:

| MediaPlayer.EVENT.* | Description |
| ----- | ----------- |
| STOPPED | Event fired when playback is stopped |
| BUFFERING | Event fired when playback has to suspend due to buffering |
| PLAYING | Event fired when starting (or resuming) playing of the media |
| PAUSED | Event fired when media playback pauses |
| COMPLETE | Event fired when media playback has reached the end of the media |
| ERROR | Event fired when an error condition occurs |
| STATUS | Event fired regularly during play - use this to update the current playback time |

### Sentinels

Some devices do not respond immediately to requests to play, pause or seek through media or do not emit expected events, such as entering buffering. To solve this problem, MediaPlayer will monitor the state of the device to keep it in sync with the API's state. As a result, the API will fire one of the sentinel events listed below. By listening to for these events in your callback, you can detect deviant media playback behaviour on the device.

| MediaPlayer.EVENT.* | Description |
| ---- | --------- |
| SENTINEL_ENTER_BUFFERING | Event fired when a sentinel has to act because the device has started buffering but not reported it |
| SENTINEL_EXIT_BUFFERING | Event fired when a sentinel has to act because the device has finished buffering but not reported it |
| SENTINEL_PAUSE | Event fired when a sentinel has to act because the device has failed to pause when expected |
| SENTINEL_SEEK | Event fired when a sentinel has to act because the device has failed to seek to the correct location |
| SENTINEL_COMPLETE | Event fired when a sentinel has to act because the device has completed the media but not reported it |

An example application snippet using media playback events to display the type of event in a label

{% highlight javascript %}
this._mediaPlayer.addEventCallback(this, function(event) {
    if(event.type === MediaPlayer.EVENT.BUFFERING) {
        this._showBufferingIcon();
    }
    else if(event.type === MediaPlayer.EVENT.PLAYING) {
        this._hideBufferingIcon();
    }
});
{% endhighlight %}

## Getting the length of the media

To get the duration of the media, in seconds, use `getDuration()`.

To get the available range in the media that can be seeked in, use `getSeekableRange()`, this will return the following object for a non-live video:

{% highlight javascript %}
{
    start:0,
    end:/* duration in seconds */
}
{% endhighlight %}

`getSeekableRange()` is especially useful for live streams, on which the seekable window changes as the live stream progresses.

## Errors
API errors (e.g. calling `pause()` while in the `STOPPED` state) are treated as fatal errors and the media player transitions to the `ERROR` state and stops all playback. After this, the player must be `reset()`.

However, device errors (network errors, playback errors, media incompatibility etc) are raised as error events in the API, but they do not cause a transition to the error state. This is because many device errors are non fatal, and playback can continue normally afterwards. It is recommended that apps similarly treat these error events as notifications, and do not display modal dialogs or end playback just because of a device error event.
