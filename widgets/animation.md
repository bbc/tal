---
layout: default
title: Animation
---
# Animation

<p class="lead">The Framework provides a number of methods to animate objects on the screen. Animation methods are provided through the device abstraction layer, allowing for the method of animation to be optimised on a device-by-device basis.</p>

These methods are primarily intended for widget developers.

## Animation methods

The following methods control animation:

* `device.moveElementTo(options)`
* `device.scrollElementTo(options)`
* `device.hideElement(options)`
* `device.showElement(options)`
* `device.stopAnimation(handle)`

All animation methods except `stopAnimation()` take an options object and return an animation handle.
`stopAnimation()` takes this animation handle.

As a minimum the `options` object needs the property

* `options.el` - The current output element of the widget to be animated.

In addition they all understand

* `options.duration`
* `options.onComplete`
* `options.skipAnim`
* `options.fps`

The movement methods also understand

* `options.easing`

## Animation properties

Animations can be configured via a set of properties. These are either passed directly to the animation methods as properties of an options object, or defined in the device configuration file.
The order of presidence is:

      options object > device configuration > default
       
with the exception of the global animation toggle, which always overrides any other setting.

### duration
How long the animation should take to complete in milliseconds.

### onComplete
A callback function that will be executed when the animation has completed.

### skipAnim 
default=false

A boolean property, if true the animation is skipped - i.e. it completes instantly and any callback is fired immediately. Overridden to true by the global animationDisabled device configuration property.

### easing 
default=easeFromTo

An easing function that defines how the rate the animation progresses over time. 
Only available on the movement functions (fades are always linear)

Acceptable values are:

* linear
* easeInCubic
* easeOutCubic
* easeInOutCubic
* easeInCirc
* easeOutCirc
* easeInOutCirc
* easeInExpo
* easeOutExpo
* easeInOutExpo
* easeInQuad
* easeOutQuad
* easeInOutQuad
* easeInQuart
* easeOutQuart
* easeInOutQuart
* easeInQuint
* easeOutQuint
* easeInOutQuint
* easeInSine
* easeOutSine
* easeInOutSine
* easeInBack
* easeOutBack
* easeInOutBack
* easeFromTo (equal to easeInOutQuart)

The following are currently supported with the styletopleft animation scheme, but not with the css3 animation scheme. They may be added to css3 or dropped from styletopleft at a later date, so should be avoided if compatibility is required.

* elastic
* swingFrom
* swingTo
* swingFromTo
* bounce
* bouncePast
* easeFrom (equal to easeInQuart)
* easeTo

### fps
default=25

This is only used for animation methods where the positions are calculated within javascript (i.e. not css3)
It determines the update rate of the animation (frames per second)



### Hiding and Showing Widgets

The best practice to hide and show widgets is normally to use Container's `appendChildWidget()` and `removeChildWidget()` methods. This will remove the widget from the UI graph and also from the rendered DOM. If however you wish to fade a widget out, or hide it from the user without removing it from either the UI graph or DOM, you can use:

{% highlight javascript %}
device.hideElement({
    el: widget.outputElement,       // mandatory
    skipAnim: true,                 // optional
    onComplete: function () {       // optional
        // on complete functionality
    }
});
{% endhighlight %}

You can then re-show the widget using:

{% highlight javascript %}
device.showElement({
    el: widget.outputElement,       // mandatory
    skipAnim: true,                 // optional
    onComplete: function () {       // optional
        // on complete functionality
    }
});
{% endhighlight %}

### Moving and scrolling Widgets

The `moveElementTo()` and `scrollElementTo()` methods have an additional `to` object as a property of `options`.

This must contain at least one of the following properties:

* `options.to.top`:      The destination value of the top edge of the element (as an integer, in pixels).
* `options.to.left`:     The destination value of the left edge of the element (as an integer, in pixels).

If you only need to move/scroll along a single axis, only supply one property.

#### moveElementTo()

Widgets may be moved within their container using the following method:

{% highlight javascript %}
device.moveElementTo({
    el: widget.outputElement,   // mandatory
    to: {
        top: 100,               // needs one item, more are optional
        left: 300
    },
    skipAnim: true,             // optional
    fps: 100,                   // optional
    duration: 100,              // optional
    easing: 'easeIn',           // optional
    offset: 100,                // optional
    onComplete: function () {   // optional
        // functionality to run after animation has finished
    }
});
{% endhighlight %}

*Note:* You must provide styling to the element to ensure it can be positioned (i.e. `position: absolute`, or `relative`).

#### scrollElementTo()

Widgets may be scrolled within a container using the following method:

{% highlight javascript %}
device.scrollElementTo({
    el: widget.outputElement,   // mandatory
    to: {
        top: 100,               // needs one item, more are optional
        left: 300
    },
    skipAnim: true,             // optional
    fps: 100,                   // optional
    duration: 100,              // optional
    easing: 'easeIn',           // optional
    offset: 100,                // optional
    onComplete: function () {   // optional
        // functionality to run after animation has finished
    }
});
{% endhighlight %}

*Note:* If an animation method other than 'scrolloffset' is used, a mask element must be created to wrap the output element. The moveElementTo(...) method will then be used on the inner element to move the visible area within the mask. The mask element must be styled to be a offset parent (i.e. `position: absolute`, or `relative`), have a size, and have `overflow: hidden`.

## Aborting Animations

Each of the above methods return an animation handle. The format and structure of this handle will vary based on the animation method used by the device, so should not be relied upon with your application, e.g:
{% highlight javascript %}
var animationHandle = device.scrollElementTo({
                        el: widget.outputElement,
                        to: {
                            top: 0,
                            left: 0
                        });
{% endhighlight %}

To abort a currently running animation, call:
{% highlight javascript %}
device.stopAnimation(animationHandle);
{% endhighlight %}

Any completion callback for the animation will still be called.

*Note:*  It is very important to call `stopAnimation()` if an animation will be interrupted by any means. This includes calling moveElementTo before a previous call has completed or hiding an animating element. If you fail to do this you may see visual discontinuities (styletopleft) or create a memory leak / experience strange callback behaviour (css3).

## Configuring animations via the device configuration files

You may configure the default show/hide fade behaviour of all widgets on a specific device via the defaults property of a device config file.

See [Device Configuration]({{site.baseurl}}/overview/device-configuration.html)

### Global application specific OFF switch

To switch off animation for a device within your application, overriding any animation settings in TAL, add the following as a property of the relevant application device configuration file:

{% highlight javascript %}
"animationDisabled" : true
{% endhighlight %}

## Additional methods on HorizontalCarousel

Three values have now been publicly exposed and are available to be defined on a per instance basis, both on and after instantiation.

#### carousel.setWidgetAnimationFPS(fps)

Accepts Integer to set frames per second for the carousel

\-\- Default value is 25 fps

#### carousel.getWidgetAnimationFPS()

Returns an Integer that reflects currently set frames per second set for the carousel

#### carousel.setWidgetAnimationDuration(duration)

Accepts Integer to set duration of animation for the carousel

\-\- Default value is 750ms

#### carousel.getWidgetAnimationDuration()

Returns an Integer that reflects currently set duration of animation for the carousel

#### carousel.setWidgetAnimationEasing(easing)

Accepts a String to set easing type for the carousel

\-\- Default value is easeFromTo.

#### carousel.getWidgetAnimationEasing()

Returns a String that reflects currently easing type for the carousel

