---
layout: default
title: Layouts and Style
---
# Layouts and Style

<p class="lead">The framework provides features to allow your application to target different screen resolutions. You will find some devices (e.g. TVs) run in a fixed resolution, whilst others, (e.g. Game Consoles) can run in different resolutions depending on user settings.</p>

## Device Config

Each device configuration file lists the supported resolutions for a given device, e.g:
{% highlight javascript %}
    "layouts": [
        {
            "width": 960,
            "height": 540,
            "module": "%application%/appui/layouts/540p",
            "classes": [
                "browserdevice540p"
            ]
        }
    ]
{% endhighlight %}
This lists the width and height of the available browser window, a reference to the application layout module (see below) and an array of class names to apply to the top-level element (e.g. `<html>`).

## Application Layout Module

The device configuration file points to a module within your application that is loaded once the framework has determined the current resolution:
{% highlight javascript %}
    require.def('yourapplication/appui/layouts/540p',
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
        },
        preloadImages: [
                "image1.png"
        ],
        images: {
                programmeInfo: {
                        width: 360,
                        height: 240,
                        url: "http://www.example.com/images/programmes/540/%id%.png"
                }
        }
    });
{% endhighlight %}
| Section            | Description |
| ------------------ | ---------------------------------------------------------------- |
| classes            | Additional class names to add to the top-level element.          |
| css                | An array of additional CSS files to load for this layout.        |
| requiredScreenSize | The minimum screen size required to show this layout.            |
| preloadImages      | An array of images to preload.                                   |
| images             | An object containing details about layout-specific images used within the application. This is application specific but recommended practice. |
| (more)             | You can add any additional properties to this layout object. This object is available to the application using `Application.getCurrentApplication().getLayout().<property>` |

## Layout CSS Files

Your application's layout modules refer to layout-specific CSS files. You should split your application's CSS into two sections:
- one without layout specific values (e.g. non-dimensional properties)
- multiple layout-specific CSS files with any dimensional properties

A typical CSS file might have a section as:

{% highlight css %}
#myWidget {
        background-color: #808080;
        background-image: url(../img/mywidget.png);
        background-repeat: no-repeat;
        padding: 20px;
        text-align: center;
}
{% endhighlight %}

This would then be separated out to:
- General CSS
{% highlight css %}
#myWidget {
        background-color: #808080;
        background-repeat: no-repeat;
        text-align: center;
}
{% endhighlight %}

- Layout Specific CSS files.
{% highlight css %}
#myWidget {
        background-image: url(../img/mywidget540.png);
        padding: 20px;
}
{% endhighlight %}
{% highlight css %}
#myWidget {
        background-image: url(../img/mywidget720.png);
        padding: 30px;
}
{% endhighlight %}
{% highlight css %}
#myWidget {
        background-image: url(../img/mywidget1080.png);
        padding: 40px;
}
{% endhighlight %}

## IDs and Built-in Class Names

The framework applies a wide range of IDs and class names to rendered DOM elements to allow you to style your application:

| ID or Class               | Description                                                        |
| ------------------------- | ------------------------------------------------------------------ |
| `#<ID>`                   | Any ID you pass to the constructor of a widget will become the ID of the element in the DOM. Please note, if you do not pass an ID, an internal ID will be generated and used internally within JavaScript. These internal IDs will not be rendered to the DOM. |
| `.widget`                 | Applied to all widgets.                                            |
| `.active`                 | Applied to active child widgets.                                   |
| `.focus`                  | Applied to any widget within the focus path.                       |
| `.rootwidget`             | Applied to the root widget (as set by `Application.setRootWidget(...)`). |
| `.container`              | Applied to Container widgets. |
| `.button`                 | Applied to Button widgets. |
| `.buttonDisabled`         | Applied to disabled Button widgets. |
| `.buttonFocussed`         | Applied to Button widgets with focus. |
| `.buttonBlurred`          | Applied to non-focused Button widgets. |
| `.label`                  | Applied to Label widgets.  |
| `.image`                  | Applied to Image widgets.  |
| `.media`                  | Applied to Media widgets.  |
| `.component`              | Applied to Components.  |
| `.componentcontainer`     | Applied to ComponentContainers.  |
| `.list`                   | Applied to List widgets.  |
| `.horizontallist`         | Applied to HorizontalList widgets.  |
| `.horizontallistmask`     | Applied to the auto-generated mask DOM element wrapping HorizontalLists.  |
| `#<ID>_mask`              | ID given to the mask DOM element of the HorizontalList with the id ID.  |
| `.verticallist`           | Applied to VerticalList widgets.  |
| `.listitem`               | Applied to child widgets of List widgets.  |
| `.grid`                   | Applied to Grid widgets.  |
| `#<ID>_row_<ROW>`         | ID given to ROW in the Grid with id ID.  |
| `#<ID>_<COL>_<ROW>`       | ID given to the cell at x=COL, y=ROW of the Grid widget with ID.  |
| `.firstcol`               | Applied to Grid child widgets in the left-most column.  |
| `.lastcol`                | Applied to Grid child widgets in the right-most column.  |
| `.spacer`                 | Applied to Grid child widget spacers (grid squares without any child widgets set).  |
| `.horizontalcarousel`     | Applied to HorizontalCarousel widgets.  |
| `.viewportPadding`        | Applied to viewport padding on HorizontalCarousel widgets.  |
| `.viewportPaddingLeft`    | Applied to the left-most viewport padding on HorizontalCarousel widgets. |
| `.viewportPaddingRight`   | Applied to the right-most viewport padding on HorizontalCarousel widgets.  |
| `.inviewport`             | Applied to HorizontalCarousel child widgets when then they are in the current viewport (when the carousel has `VIEWPORT_MODE_CLASSES`). |
| `.nearviewport`           | Applied to HorizontalCarousel child widgets when then they are near the current (when the carousel has `VIEWPORT_MODE_CLASSES`). |
| `.clone`                  | Applied to clone DOM elements in a HorizontalCarousel with `WRAP_MODE_VISUAL`. |
| `.keyboard`               | Applied to Keyboard widgets.  |
| `.key<LETTER>`            | Applied to Keyboard child widget for LETTER.  |
| `.maxlength`              | Applied to Keyboard widgets when the currently entered text is the maximum allowed.  |
| `.horizontalprogress`     | Applied to HorizontalProgress widgets.  |
| `#<ID>_left`              | ID given to the filled area to the left of the HorizontalProgress widget with id ID.  |
| `#<ID>_inner`             | ID given to the handle of the HorizontalProgress widget with id ID.  |
| `#<ID>_label`             | ID given to the position label of the HorizontalProgress widget with id ID.  |
| `.haslabel`               | Applied to HorizontalProgress widgets which have a child Label.  |
| `.horizontalslider`       | Applied to HorizontalSlider widgets.  |
| `.horizontalsliderhandle` | Applied to the handle Button of a HorizontalSlider.  |
| `#<ID>_handle`            | ID given to the handle of the HorizontalSlider widget with id ID. |
| `.horizontalsliderleft`   | Applied to the filled area to the left of a HorizontalSlider handle.  |
| `#<ID>_left`              | ID given to the filled area to the left of the handle of the HorizontalSlider widget with id ID.  |
| `.start`                  | Applied to a HorizontalSlider widget when it's at its left-most position (value = 0).  |
| `.end`                    | Applied to a HorizontalSlider widget when it's at its right-most position (value = 1).  |
| `.scrubbarbuffer`         | Applied to the filled area of a ScrubBar widget indicating the buffered range.  |
| `.textpager`              | Applied to TextPager widgets.  |
| `#<ID>_inner`             | ID given to inner text area of the TextPager widget with id ID.  |
| `.animating`              | Applied to the top-level element during an animation caused by a Device.\* call.  |
| `.notanimating`           | Applied to the top-level element when an animation has finished.  |
| `.moving`                 | Applied to an element being moved via a `Device.moveElementTo()` call.  |
| `.notmoving`              | Applied to an element that has been moved once the animation has completed.  |
| `.scrolling`              | Applied to an element being moved via a `Device.scrollElementTo()` call. |
| `.notscrolling`           | Applied to an element that has been scrolled once the animation has completed. |

## Important CSS Considerations

There are a number of important rules to keep in mind when styling:
*   `.horizontallistmask` elements are block elements with `overflow: hidden` therefore must be given a width and height for their content to be visible.
*   You can add classes to the entire app via page strategies if you need to target styles at a particular family of device
*   The framework adds an `.animating` and `.notanimating` class name to the top-level element when animations are occurring or are idle.
*   If targeting devices that play video behind the browser, you may want to add a `.playing` or `.backgroundPlaying` class name to the top-level element whilst video is playing, allowing you to remove any body/application background images/colours that may obscure the video.
*   If targeting games consoles do not use multi-class selectors on a single element, e.g: `.class1.class2,` if you need to do this, use code to build compound class names, e.g. `.class1Class2`. Some consoles do not support multi-class selectors.
*   On some consoles, when using `display: inline-block`, you may need to `float` the element to the `left`
*   Some consoles do not support the outline property.

## Image Spriting

The default build scripts make use of *[Smart Sprites](http://csssprites.org/)* to allow optimised sprite images to be created at build time.

You'll most likely use Smart Sprites within your layout-specific CSS as each layout will require different images and therefore sprites.

Once you have created a section of your UI or a feature that contains multiple background images for UI furniture, add a sprite definition tag to your CSS:
{% highlight css %}
/** sprite: carousel720; sprite-image: url('../../img/carousel_sprites_720.png'); */
{% endhighlight %}
Then for each `background-image:` property that you wish to include into this sprite image, add the tag:
{% highlight css %}
background-image: url('../../img/carousel/carousel_content_normal_720.png'); /** sprite-ref: carousel720; */
{% endhighlight %}
Notes:
* All `background-*:` properties must be included separately. Do NOT use the compound `background: <image> <repeat> <position>;` syntax.
* The `sprite-ref` must be unique across the whole application. For example you must not use 'carousel' in multiple CSS files for different layouts, or all images will be placed into one sprite.
* Smart Sprites has been modified to allow pixel and percentage values in the `sprite-alignment:` property.
* The build will fail if you incorrectly tag images, for example do not create a sprite definition before referencing it or have missing images.
* If you use `background-position:` property, do so before the `background-image:` property. This will allow smart-sprites to overwrite the position with the correct offset into the sprite image.
