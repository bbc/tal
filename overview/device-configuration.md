---
layout: default
title: Device Configuration
---
# Device Configuration Files

<p class="lead">Device configurations are managed by a set of JSON files.
Each file represents a device or family of similar devices.</p>

Configuration is split into two sets. The framework configuration files
which specify a set of default values required by the framework itself, and an
application file which can override these defaults and include additional
configuration properties relevant to an application. 

## Framework Configuration

The following properties are required within each framework device
configuration:

### pageStrategy (string)
Used in page construction
(see [Creating an Index]({{site.baseurl}}/getting-started/tutorial/createanindex.html))

| Strategy       | Description |
| -------------- | ----------- |
| `html5`        | For html5 compatible browsers. Use this if supported by device |
| `hbbtv`        | For hbbtv compatible devices |
| `samsungmaple` | For samsung devices running in maple mode (use html5 instead unless specifically needed) |
  
###modules (object)
The require modules which should be loaded to implement the device abstraction layer. Each module applies platform specific overrides or implementations that run while the app is starting up. For example, including the `antie/devices/anim/noanim` modifier will disable animations for that platform.

####modules.base (string)
The module on which the device is based. This will usually be antie/devices/browserdevice.

####modules.modifiers (array)
Mix-in modules to support common implementations of the abstraction layer. This must contain one module from each of the following namespaces

* `antie/devices/anim/*` -- Animation
* `antie/devices/mediaplayer/*` -- Media playback
* `antie/devices/media/*` -- Media playback (deprecated)
* `antie/devices/data/*` -- JSON parsing
* `antie/devices/net/*` -- Network implementation
* `antie/devices/storage/*` -- Persistent storage implementation
* `antie/devices/exit/*` -- Application exit method

It should also include all of the supported modules from

* `antie/devices/logging/*` - Log output method 

#####Animation Modifiers

| Module name                              | Description |
| ---------------------------------------- | ----------- |
| `antie/devices/anim/noanim`              | Device does not support animation - It will be disabled within the framework. |
| `antie/devices/anim/css3`                | Animation via css3 transitions - Generally the best performance, if it works use this. |
| `antie/devices/anim/styletopleft`        | Animation via tweening style.top and style.left with JavaScript. For reasonably quick devices which do not support css3. |
| `antie/devices/anim/scrolloffset`        | Deprecated |

#####Media playback modifiers

| Module name                             | Description |
| --------------------------------------- | ----------- |
| `antie/devices/mediaplayer/html5`             | The html5 `<video>` element is used for media playback. |
| `antie/devices/mediaplayer/cehtml`            | CE-HTML is used for media playback |
| `antie/devices/mediaplayer/samsung_maple`     | Samsung's Device API and Player object are used for media playback |

#####Media playback modifiers (deprecated)

| Module name                             | Description |
| --------------------------------------- | ----------- |
| `antie/devices/media/html5`             | The html5 `<video>` element is used for media playback. |
| `antie/devices/media/cehtml`            | CE-HTML is used for media playback |
| `antie/devices/media/samsung_maple`     | Samsung's Device API and Player object are used for media playback |

#####Data modifiers

| Module name                             | Description |
| --------------------------------------- | ----------- |
| `antie/devices/data/nativejson`         | ECMAScript 5 JSON object used for parsing |
| `antie/devices/data/json2`              | Douglas Crockford's json2.js library used for parsing |

#####Network modifiers

| Module name                             | Description |
| --------------------------------------- | ----------- |
| `antie/devices/net/default`             | Use XHR for network requests |

#####Storage modifiers

| Module name                             | Description |
| --------------------------------------- | ----------- |
| `antie/devices/storage/cookie`          | Use persistant cookies for storage |

#####Exit modifiers

| Module name                             | Description |
| --------------------------------------- | ----------- |
| `antie/devices/exit/history`            | Exits the application by going to the first item in the browser history |
| `antie/devices/exit/closewindow`        | Exits the application by calling window.close() |

#####Logging modifiers

| Module name                             | Description |
| --------------------------------------- | ----------- |
| `antie/devices/logging/default`         | Log messages are output via the global `console` object |
| `antie/devices/logging/onscreen`        | Log messages are displayed on screen in a DIV element |
| `antie/devices/logging/consumelog`      | Log messages are disabled |
| `antie/devices/logging/alert`           | Log messages output via window.alert() |
| `antie/devices/logging/jstestdriver`    | Log messages output via the jstestdriver console object (for use within unit tests) |
| `antie/devices/logging/xhr`             | Remote logging |

###logging (object)

####logging.level (string)

The framework supports the following log types, in ascending severity

1. `log`
2. `debug`
3. `info`
4. `warn`
5. `error`

If the `logging.level` property is set to one the above types, the framework logs all messages of equal or greater severity then that specified, i.e. the type specified and all those below it in the list.

There are two more options

* `all`
* `none`

Which log all or no messages respectively.

All framework configurations should have this value set to `none`. If logging is required it should be overridden by applications only during development.

###streaming (object)
Details of media support for the device, including codecs, protocols and limits.

The default is `%href%`

####streaming.video (object)
Video specific media information

#####streaming.video.mediaURIFormat (string)
One or more tags (e.g. %tagname%) used when building media URLs.

#####streaming.video.supported (array of profile objects)
An array of supported profile objects. (see below)

####streaming.audio (object)
Audio specific media information

#####streaming.audio.mediaURIFormat (string)
See steaming.video.mediaURIFormat

#####streaming.audio.supported (array of profile objects)
An array of supported profile objects. (See below)

####Profile objects

`profile.protocols` __(array of strings)__

Supported protocols, eg. 'http', 'https', 'rtmp'

`profile.encodings` __(array of strings)__

An array of encodings, e.g. 'h264', 'mp3', 'wmv'

`profile.maximumBitRate` __(integer)__
maximum bit rate supported by the device in kbps

`profile.maximumVideoLines` __(integer, video profiles only)__
The maximum number of horizontal lines (i.e. vertical resolution) the device supports. e.g. 1080.

###input (object)
Information about user input

####input.map(object)
Map from raw key codes to their semantic meanings.
Valid symbols for the mappings are as follows (bold are mandatory):

* __UP__
* __DOWN__
* __LEFT__
* __RIGHT__
* __ENTER__
* BACK
* SPACE
* BACK_SPACE
* PLAY
* PAUSE
* PLAY_PAUSE
* STOP
* PREV
* NEXT
* FAST_FWD
* REWIND
* SUBTITLE
* INFO
* VOLUME_UP
* VOLUME_DOWN
* MUTE
* A -- Z
* 0 -- 9

The map may also contain the following shortcuts:

| Shortcut | Description |
| -------- | ----------- |
| alpha    | An array of 2 numbers specifying the range A-Z |
| alpha    | An array of 2 numbers specifying the range A-Z |
| numeric  | An array of 2 numbers specifying the range 0-9 |
| multitap | Details of number -> character mappings when multi-tap is used. If provided, must contain an array of 10 strings (one for each number). The characters of each string will be cycled through when the digits 0-9 are repeatedly pressed. |

Care should be exercised when using optional keys within an application as not all devices will support them.

###accessibility (object)
Accessibility related device information

####accessibility.captions (object)
Device support of subtitles

#####accessibility.captions.supported (array of strings)
An array of MIME types for supported subtitle formats (e.g. `application/ttaf+xml`)

###layouts (array of layout objects)
Details of resolutions the device's browser may run in, these must be supported by each application that wishes to run on the device.

###Layout objects

`layout.width` (integer)

Minimum screen width required for this layout in pixels

`layout.height` (integer)

Minimum screen height required for this layout in pixels

`layout.module` (string)

Application require module used to configure this layout (%application% tag will be replaced by the application ID)

`layout.classes` (array of strings)
CSS Class names to add to the top-level element when this layout is used.

`layout.css` (array of strings)
Additional CSS files to load for this layout (relative to the styleBaseUrl passed to the application constructor)

###networking (object)
Network related information

####networking.supportsJSONP (boolean)
Whether a device can successfully load JSON objects via JSONP.

##Optional properties
The following properties may be added to framework device configuration files, but are not compulsary

###\_comment (string)
A human readable comment about the configuration

###defaults (object)
Animation defaults

####defaults.showElementFade (object)
An animation options object describing how fade-ins should behave. See [Animation][].

####defaults.hideElementFade (object)
An animation options object describing how fade-outs should behave. See [Animation][].
[Animation]: {{site.baseurl}}/widgets/animation.html

##Application Configuration

In addition to the framework configuration, it is likely you will want to specify application specific properties per device.

It is TAL convention to do this via a separate JSON file, then merge the two to a single object

There is a method `mergeConfigurations()` in the _AntieFramework_ php class for merging device configurations. Note that `mergeConfigurations()` overrides any properties present in the original with those present in the patch.

##Example Framework Configuration file
{% highlight json %}
{
  "pageStrategy": "html5",
  "modules": {
    "base": "antie/devices/browserdevice",
    "modifiers": [
      "antie/devices/anim/styletopleft",
      "antie/devices/media/html5",
      "antie/devices/net/default",
      "antie/devices/data/nativejson",
      "antie/devices/storage/cookie",
      "antie/devices/logging/onscreen",
      "antie/devices/logging/xhr",
      "antie/devices/logging/jstestdriver",
      "antie/devices/exit/closewindow"
    ]
  },
  "logging": {
    "level": "none"
  },
  "streaming": {
    "video": {
      "mediaURIFormat": "%href%",
      "supported": [
        {
          "protocols": [
            "http"
          ],
          "encodings": [
            "h264"
          ],
          "transferFormat": [
            "hls",
            "plain"
          ],
          "maximumBitRate": 3600,
          "maximumVideoLines": 1080
        }
      ]
    },
    "audio": {
      "mediaURIFormat": "%href%",
      "supported": [
        {
          "protocols": [
            "http"
          ],
          "encodings": [
            "aac"
          ],
          "maximumBitRate": 192
        }
      ]
    }
  },
  "input": {
    "map": {
      "13": "ENTER",
      "37": "LEFT",
      "38": "UP",
      "39": "RIGHT",
      "40": "DOWN",
      "112": "SUBTITLE",
      "113": "PLAY",
      "415": "PLAY",
      "114": "PLAY_PAUSE",
      "19": "PLAY_PAUSE",
      "402": "PLAY_PAUSE",
      "115": "STOP",
      "413": "STOP",
      "116": "FAST_FWD",
      "417": "FAST_FWD",
      "117": "REWIND",
      "412": "REWIND",
      "166": "BACK",
      "8": "BACK"
    }
  },
  "accessibility": {
    "captions": {
      "supported": [
        "application/ttaf+xml"
      ]
    }
  },
  "layouts": [
    {
      "width": 960,
      "height": 540,
      "module": "%application%/appui/layouts/540p",
      "classes": [
        "browserdevice540p"
      ]
    },
    {
      "width": 1280,
      "height": 720,
      "module": "%application%/appui/layouts/720p",
      "classes": [
        "browserdevice720p"
      ]
    }
  ],
  "networking": {
    "supportsJSONP": true
  }
}
{% endhighlight %}
