---
layout: default
title: Example layout and basic style
---
[layout and styling]: {{site.baseurl}}/overview/layouts.html
[index.php]: exampleindex.html
[A first component]: firstcomponent.html

# Example layout and basic style

Framework applications are generally built for specific resolutions. To accomplish this, each application needs a set of layout modules and resolution specific style sheets (see [layout and styling][]).

## Layout Modules

Layout modules allow resolution specific css, images and other data to be made available to an application.

The framework's device configuration files assume that at a minimum, layout modules and css for the following display modes exist within the application.

| Mode     | Width (pixels)  | Height (pixels) | Layout Module              |
| -------- | --------------- | --------------- | -------------------------- |
| 1080p    | 1920            | 1080            | APP_ID/appui/layouts/1080p |
| 720p     | 1280            | 720             | APP_ID/appui/layouts/720p  |
| 540p     | 960             | 540             | APP_ID/appui/layouts/540p  |

Where APP_ID is the application id defined in [index.php][] and substituted into the device configurations on load.

The framework will select the largest resolution which will fit a device without scaling.

## Example Modules

Below are minimal layout files for these three resolutions. 

{% highlight javascript %}
require.def('sampleapp/appui/layouts/1080p',
    {
        classes: [
            "mylayout1080p"
        ],
        css: [
            "layouts/1080p.css"
        ],
        requiredScreenSize: {
            width: 1920,
            height: 1080
        }
    }
);
{% endhighlight %}

{% highlight javascript %}
require.def('sampleapp/appui/layouts/720p',
    {
        classes: [
            "mylayout720p"
        ],
        css: [
            "layouts/720p.css"
        ],
        requiredScreenSize: {
            width: 1280,
            height: 720
        }
    }
);
{% endhighlight %}

{% highlight javascript %}
require.def('sampleapp/appui/layouts/540p',
    {
        classes: [
            "mylayout540p"
        ],
        css: [
            "layouts/540p.css"
        ],
        requiredScreenSize: {
            width: 960,
            height: 540
        }
    }
);
{% endhighlight %}

The css links are relative to the style directory passed in to the constructor of the application module.
In this case that was static/style/, so if using the above layouts, the layout specific css files required are

* static/style/layouts/1080p.css
* static/style/layouts/720p.css
* static/style/layouts/540p.css

These can be empty, but they need to exist or you will encounter load errors.

## Base style sheet

In addition to the specific layouts, there will be styles that need to apply to elements regardless of resolution.

Some defaults are required in order for widgets to render correctly.

The base style sheet handles these defaults and resolution independent styles. It was loaded by [index.php][] from static/style/layout.css

A minimal example is below:


{% highlight css %}
/* Document */
html {
    height: 100%;
}

body {
    height: 100%; 
    margin: 0;
    padding: 0;
    color: #ffffff;
}

/* List widgets */
.horizontallist, .verticallist {
    position: relative;
}

.horizontallist .listitem {
    display: inline-block;
}

/* nested lists - use #IDs instead for more complex layouts */
.verticallist .horizontallist .listitem {
    display: inline-block;
}

.verticallist .listitem {
    display: block;
    position: relative;
}

/* nested lists - use #IDs instead for more complex layouts */
.horizontallist .verticallist .listitem {
    display: block;
}


/* Horizontal carousel widgets */
/* the mask is the top level of the carousel and defines where it is displayed and how much is visible */
.horizontallistmask {
    overflow: hidden;
    width: 100%;
}

/* ensure nested carousels have correct formatting, you may need to target IDs in complex layouts */
.horizontallistmask .horizontallist .listitem {
    display: inline-block;
}

.horizontalcarousel {
    width: 99999px; /* needs to be big enough so carousel plus clones do not flow onto more then one line */
}


/* DEVICE SPECIFIC DEFAULTS */

/* if you target some consoles you may need to add additional styles like this */
.someConsoles .horizontallist .listitem {
    display: inline-block;
    float: left;
}


/* If you target some older tv models, you will need to specify
   initial element background in the base stylesheet, not in dynamically loaded styles. */

.sometv.layout540p #app {
    width: 960px;
    height: 540px;
    /*background-image: url(some/image/url_540.png); */
}

.sometv.layout720p #app {
    width: 1280px;
    height: 720px;
    /*background-image: url(some/image/url_720.png); */
}

.sometv.layout1080p #app {
    width: 1920px;
    height: 1080px;
    /*background-image: url(some/image/url_1080.png); */
}

{% endhighlight %}

Previous page [A first component][]