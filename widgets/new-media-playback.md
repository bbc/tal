---
layout: default
title: Media Playback (Improved)
---
# Media Playback (Improved)

TAL provides an device-agnostic media playback API via the [`MediaPlayer`](http://fmtvp.github.io/tal/jsdoc/symbols/antie.devices.mediaplayer.MediaPlayer.html) class. This can be used to play video and audio files supported by the device.

> This deprecates the [old media playback API](media-playback.html) from TAL 2.1.7 onwards, offering improved media playback across devices.

The framework only supports the the playback of one item of media at a time.
Video can be only be played in full screen.

## Creating a media player

This can be done in a device-agnostic way through the application's `Device` object.

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

The media playback state changes as API methods are called. Different API methods have different effect depending on the playback state. Transitions to the `STOPPED` and `ERROR` state have been limited in the state diagram below for clarity. Transitions occur synchronously in response to API methods, expect those marked by an asterisk (*) which result from asynchronous behaviour such as buffering or at the end of media.
 
![MediaPlayer playback states](/tal/img/widgets/new_media_states.png)

The playback state can be accessed using `getState()`.

## Setting the media (audio or video) source

To set the source of the media, the MediaPlayer must be in the `EMPTY` state.
You can set the media source by using the `setSource()` method.
It takes a mediaType (`MediaPlayer.TYPE.VIDEO` or `MediaPlayer.TYPE.AUDIO`), a url and the mimeType of the file.

For example, to load a video:

{% highlight javascript %}
this._mediaPlayer.setSource(MediaPlayer.TYPE.VIDEO, "http://my.madeupvideo.com/somevid.mp4","video/mp4");
{% endhighlight %}

If setting the source is successful, the playback state will change to `STOPPED` and an event will be emitted of type `MediaPlayer.EVENT.STOPPED`.

From the `STOPPED` state, `MediaPlayer` can be used to access the properties of the media source (`getSource()`, `getMimeType()`, `getMimeType()`);

To change the media source, applications must ensure the MediaPlayer is in the `STOPPED` state and call `reset()` to transition to the `EMPTY` state before calling `setSource()` with a different URL.

## Playing and seeking through media

The `playFrom(seconds)` method will attempt to play the media from the provided time (in seconds).

For example, to play media from the start: 

{% highlight javascript %}
this._mediaPlayer.playFrom(0);
{% endhighlight %}

This will cause the playback state to change to `BUFFERING` and an event emitted of type `MediaPlayer.EVENT.BUFFERING`.

When the device has loaded enough of the video to begin playback, the MediaPlayer will transition to the `PLAYING` state and an event of type `MediaPlayer.EVENT.PLAYING` emitted.

The device may be connected to a slow network connection, meaning the rate of video download is slower than the playback speed.
When this occurs, the MediaPlayer will enter the `BUFFERING` state asynchronously and an event emitted of type `MediaPlayer.EVENT.BUFFERING` (as above).
By adding an event callback to listen to these events, you can update your application's interface to ...see later

`playFrom(seconds)` can be used to seek to different points in the media. If the seconds parameter is larger than the duration of the media, the value will be clamped and playback will begin from just before the end. Requests to seek within one second of the correct time will be ignored to ensure consistent behaviour across devices.

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

These are all the lifecycle events fired by a media player that client applications can listen for. These are prefixed with MediaPlayer.EVENT, so you will need to include the MediaPlayer class in your class definition.

| Event | Description |
| ----- | ----------- |
| STOPPED | Event fired when playback is stopped |
| BUFFERING | Event fired when playback has to suspend due to buffering |
| PLAYING | Event fired when starting (or resuming) playing of the media |
| PAUSED | Event fired when media playback pauses |
| COMPLETE | Event fired when media playback has reached the end of the media |
| ERROR | Event fired when an error condition occurs |
| STATUS | Event fired regularly during play - use this to update the current playback time |
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

Some devices do not respond immediately to requests to play, pause or seek through media or do not emit expected events, such as entering buffering. To solve this problem, MediaPlayer will monitor the state of the device to keep it in sync with the API's state. As a result, the API will fire one of the sentinel events listed above.

## Getting the length of the media

To get the duration of the media, in seconds, use `getDuration()`.

To get the available range in the media that can be seeked in, use `getSeekableRange()', this will return the following object for a non-live video:

{% highlight javascript %}
{
    start:0,
    end:/* duration in seconds */
}
{% endhighlight %}

`getSeekableRange()` is especially useful for live streams, on which the seekable window changes as the live stream progresses.

## Example media player component

The following is an example of a `Component` that makes use of the `MediaPlayer` to control video and output its playback state to labels. 

{% highlight javascript %}
require.def('exampleapp/appui/components/examplemediaplayer',
    [
         'antie/widgets/component',
         'antie/widgets/horizontallist',
         'antie/widgets/button',
         'antie/widgets/label',
         'antie/events/keyevent',
         'antie/devices/mediaplayer/mediaplayer'
    ],

function(Component, HorizontalList, Button, Label, KeyEvent, MediaPlayer) {
    var ExampleMediaPlayer = Component.extend({
        init: function() {
            this._super('ExampleMediaPlayer');
            var self = this;
            
            //create labels for the state, time and range

            this._stateLabel = new Label("state", "EMPTY");
            this.appendChildWidget(this._stateLabel);

            this._currentTime = new Label("currentTime", "");
            this.appendChildWidget(this._currentTime);

            this._rangeLabel = new Label("mediaRange", "");
            this.appendChildWidget(this._rangeLabel);

            //button handler
            this.addEventListener('keydown', function(ev) {
                self._onKeyDown(ev);
            });
            
            //create a list of buttons to control the media playback
            this._buttons = new HorizontalList("playerButtons");
            this._buttons.setWrapMode(HorizontalList.WRAP_MODE_WRAP);
            
            this.appendChildWidget(this._buttons);

            var playPause = new Button('playPause');
            playPause.appendChildWidget(new Label('|>'));
            this._buttons.appendChildWidget(playPause);
            playPause.addEventListener('select', function() {
                if(self._player.getState() == MediaPlayer.STATE.PAUSED){
                    self._player.resume();
                }
                else if(self._player.getState() == MediaPlayer.STATE.STOPPED){
                    self._player.playFrom(0);
                }
                else if(self._player.getState() == MediaPlayer.STATE.COMPLETE){
                    self._player.playFrom(0);
                }
                else if(self._player.getState() == MediaPlayer.STATE.PLAYING){
                    self._player.pause();
                }
            });

            var stop = new Button('stop');
            stop.appendChildWidget(new Label('stop'));
            this._buttons.appendChildWidget(stop);
            stop.addEventListener('select', function() {
                try {
                    self._player.stop();
                }
                catch(e) {}
            });

            var restart = new Button('restart');
            restart.appendChildWidget(new Label('|<'));
            this._buttons.appendChildWidget(restart);
            restart.addEventListener('select', function() {
                try {
                    self._player.playFrom(0);
                }
                catch(e) {}
            });

            var skipBack = new Button('skipBack');
            skipBack.appendChildWidget(new Label('<<'));
            this._buttons.appendChildWidget(skipBack);
            skipBack.addEventListener('select', function() {
                var currentTime = self._player.getCurrentTime();
                try {
                    self._player.playFrom(currentTime - 5);
                }
                catch(e) {}
            });

            var skipForward = new Button('skipForward');
            skipForward.appendChildWidget(new Label('>>'));
            this._buttons.appendChildWidget(skipForward);
            skipForward.addEventListener('select', function() {
                var currentTime = self._player.getCurrentTime();
                try {
                    self._player.playFrom(currentTime + 5);
                }
                catch(e) {}
            });

            this.addEventListener('beforerender', function(ev) {
                self._onBeforeRender(ev);
            });
        },

        _onBeforeRender: function(ev) {
            this._mediaType = ev.args.mediaType;
            this.createPlayer();
            var startTime = ev.args.startTime;
            this.requestPlay(ev.args.url, ev.args.mimeType, ev.args.notes, ev.args.autoplay, this._mediaType, startTime);
        },

        _removeBackground: function () {
            if (this._haveRemovedBackground === undefined && this._mediaType !== MediaPlayer.TYPE.AUDIO) {
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
        },

        destroyPlayer: function() {
            try {
                this._player.stop();
            }
            catch(e) {}

            try {
                this._player.reset();
            }
            catch(e) {}

            this._player.removeAllEventCallbacks();
            this._player = null;
        },

        /* create a MediaPlayer */
        createPlayer: function() {
        
            this._player.addEventCallback(this, function(event) {
                this._currentTime.setText("Time: " + this._player.getCurrentTime());
                this._stateLabel.setText("State:" + this._player.getState());
            };

            var application = this.getCurrentApplication();
            var device = application.getDevice();
            this._player = device.getMediaPlayer();
            this._mediaPlayer.addEventCallback(this, function(event) {
               this._stateLabel.setText("Event type: " + event.type);
            });
        },
        
        /*call this from an
        requestPlay: function(url, mimeType, autoplay, mediaType) {

            this._player.setSource(mediaType, url, mimeType);

            if (autoplay !== "none") {
                if (startTime === undefined) {
                    this._player.beginPlayback();
                } else if (startTime.length) {
                    for (var i = 0; i < startTime.length; i++) {
                        this._player.playFrom(startTime[i]);
                    }
                } else {
                    this._player.playFrom(startTime);
                }

                if (autoplay === false) {
                    this._player.pause();
                }
            }
        },
    });

    return ExampleMediaPlayer;
});
{% endhighlight %}