---
layout: default
title: New Media Playback
---
# Media Playback

TAL provides an device-agnostic media playback API abstraction layer via the [MediaPlayer](http://fmtvp.github.io/tal/jsdoc/symbols/antie.devices.mediaplayer.MediaPlayer.html) class. This can be used to play video and audio files supported by the device.

This deprecates the [old media playback API](media-playback.html) from TAL 2.1.0 onwards and fixes numerous existing issues with media playback.

The framework only supports the the playback of one item of media at a time.
Video can be only be played in full screen.

## Creating a media player

This can be done in a device-agnostic way through the application's Device object.

Access the Device object by including RuntimeContext in the class definition and using RuntimeContext.getDevice().

Create a media player using:

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
        'antie/devices/mediaplayer/mediaplayer'
    ],
    function(Component, RuntimeContext, MediaPlayer) {
        var ExampleMediaPlayer = Component.extend({
            init : function() {
                this._super('ExampleMediaPlayer');
                this._mediaPlayer = RuntimeContext.getDevice().getMediaPlayer();
            }
        });
    return ExampleMediaPlayer;  
});        
{% endhighlight %}

## Playback States

The MediaPlayer has a number of playback states (ERROR, EMPTY, STOPPED, BUFFERING, PLAYING, PAUSED and COMPLETE) which effect the behaviour of API calls. The state diagram below describes how API calls will effect the playback state. API calls cause state transitions to occur synchronously. Buffering events cause state transitions to occur asynchronously and are marked by an asterisk (*). 

![MediaPlayer playback states](/tal/img/widgets/new_media_states.png)

## Setting the media (audio or video) source

To set the source of the media, the MediaPlayer must be in the EMPTY state.
You can set the media source by using the setSource() method.
It takes a mediaType (MediaPlayer.TYPE.VIDEO or MediaPlayer.TYPE.AUDIO), a url to the media resource and the mimeType of the file.

For example, to load a video:

{% highlight javascript %}
this._videoPlayer.setSource(
    MediaPlayer.TYPE.VIDEO,
    "http://my.madeupvideo.com/somevid.mp4",
    "video/mp4"
);
{% endhighlight %}

If setting the source is successful, the playback state will change to STOPPED and an event will be emitted of type MediaPlayer.EVENT.STOPPED.

From the STOPPED state, MediaPlayer can be used to access the properties of the media source (getSource(), getMimeType(), getMimeType());

## Playing and seeking through media

The playFrom(seconds) method will attempt to play the media from the provided time (in seconds).

For example, to play media from the start: 

{% highlight javascript %}
this._videoPlayer.playFrom(0);
{% endhighlight %}

This will cause the playback state to change to BUFFERING and an event emitted of type MediaPlayer.EVENT.BUFFERING.

When the device has loaded enough of the video to begin playback, the device will issue an event of type MediaPlayer.EVENT.PLAYING.

The device may be connected to a slow network connection, meaning the rate of video download is slower than the playback speed.
When this occurs, the MediaPlayer will enter the BUFFERING state asynchronously and an event emitted of type MediaPlayer.EVENT.BUFFERING (as above).
By adding an event callback to listen to these events, you can update your application's interface to ...see later

playFrom(seconds) can be used to seek to different points in the media. If the seconds parameter is larger than the duration of the media, playback will begin from just before the end.

## Stopping media

To interrupt playback you can call:
{% highlight javascript %}
this._videoPlayer.pause();
{% endhighlight %}

To resume playback:
{% highlight javascript %}
this._videoPlayer.resume();
{% endhighlight %}

If you want to close down the video player completely, for example if you are navigating to a different component, you should call

{% highlight javascript %}
this._videoPlayer.stop();
{% endhighlight %}

## Media playback events

MediaPlayer will emit events to notify the application of changes in the playback state.

To listen for these events in your application, use the addEventCallback method.

{% highlight javascript %}
this._videoPlayer.addEventCallback(this, function(event) {
    //handle events
});
{% endhighlight %}

These are all the lifecycle events fired by a media player that client applications can listen for. These are prefixed with MediaPlayer.EVENT, so you will need to include the MediaPlayer class in your class definition.

| Event | Description |
| ----- | ----------- |
| STOPPED | Event fired when playback is stopped |
| BUFFERING | Event fired when playback has to suspend due to buffering |
| PLAYING | Event fired when starting (or resuming) playing of the media |
| PAUSED | Event fired when media playback pauses |
| COMPLETE | Event fired when media playback has reached the end of the media |
| ERROR | Event fired when an error condition occurs |
| STATUS | Event fired regularly during play |
| SENTINEL_ENTER_BUFFERING | Event fired when a sentinel has to act because the device has started buffering but not reported it |
| SENTINEL_EXIT_BUFFERING | Event fired when a sentinel has to act because the device has finished buffering but not reported it
| SENTINEL_PAUSE | Event fired when a sentinel has to act because the device has failed to pause when expected
| SENTINEL_SEEK | Event fired when a sentinel has to act because the device has failed to seek to the correct location
| SENTINEL_COMPLETE | Event fired when a sentinel has to act because the device has completed the media but not reported it

An example application snippet using media playback events to display the type of event in a label

{% highlight javascript %}
this._mediaPlayer.addEventCallback(this, function(event) {
   this._stateLabel.setText("Event type: " + event.type);
});
{% endhighlight %}

## Sentinels

Sentinels attempt to correct devices which deviate from expected behaviour.