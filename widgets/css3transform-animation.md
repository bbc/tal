---
layout: default
title: CSS3 Transform Animation (Experimental)
---
# CSS3 Transform Animation (Experimental)

<p class="lead">
This is an <i>experimental</i> animation modifier which uses CSS transforms and minimal JavaScript to bring better performing animations to the TV Application Framework.
</p>

Read more about how the framework handles animation on the general [Animation page](animation.html).

## Usage

Use this modifier by:

1. [Configuring your device](../overview/device-configuration.html) to use the `antie/devices/anim/css3transform` animation modifier.
2. [Reviewing the suggested CSS tweaks](#suggestions-for-performance) for your application.

## Caveats

As the value of this animation modifier is still being proven, the following caveats apply. Some of these may change in the future as the modifier improves.

* Multiple animation operations applied to the same widget in quick succession are not queued or merged; the last one simply "wins". This should not be problematic if you are only animating [TAL's built-in Carousels](carousel.html), as these cancel the previous animation before triggering a new one, but it may cause trouble if you're performing custom animations.
* The only widget properties that can be animated are:
  * opacity (via `showElement()`, `hideElement()` and `tweenElementStyle()`)
  * left, top (via `scrollElementTo()` and `moveElementTo()`, implemented using CSS `transform` operations)
  * width, height (via `tweenElementStyle()`)

## Rationale

The existing animation modifiers - _styletopleft_ and _css3_ - are quite heavyweight in terms of JavaScript that must be executed for every animation operation. This can lead to poor animation performance on devices that have weak CPU capabilities but relatively strong graphics hardware.

By contrast, this animation modifier is intended to be lightweight in terms of the code it will execute, depending more heavily on efficient CSS transitions. This means [there are some caveats to its use](#caveats).

This modifier is particularly strong when it comes to moving widgets around the screen. The other animation modifiers achieve this by manipulating the `top` and `left` properties of the underlying DOM element, which results in Paint operations by the browser. This modifier achieves smoother animation by using CSS Transforms with the `translate3d()` function. Compatible devices are able to promote the element being animated to a separate layer and accelerate its movement using the GPU, resulting in improved performance. This is especially relevant when scrolling TAL's [Carousel widget](carousel.html).

Widget resize and opacity operations also benefit from lighter-weight JavaScript, meaning less code has to run while the device is running the transition.

## Animation flow

When an animation is requested using one of the [framework's animation methods](animation.html), the following process is followed:

* Only if required: the initial style properties (e.g. opacity) are set on the DOM element and a redraw is forced, to ensure the animation starts from the correct point.
* The CSS `transition` property is set on the underlying DOM element, specifying duration and easing properties for the properties being changed.
* Appropriate style properties are set on the element to move it to its final state: the `transform` property utilising `translate3d()` for moving position, and `width`, `height` or `opacity` properties for size and opacity changes.
* The framework listens for the `transitionend` DOM event (and vendor-specific equivalents) to signal the end of the animation, and when it arrives:
  * Removes the CSS `transition` property. This ensures that subsequent changes are not animated by accident.
  * For position changes only: At the end of the transition, the element is moved to its final position via `top` or `left` properties, and the `transform` is reset. This ensures that other elements flow correctly with respect to the element being moved.

For the `transition` and `transform` CSS properties, the framework sets [vendor-prefixed versions](#vendor-prefixes) (such as `-webkit-transition` and `-webkit-transform`) in addition to the base, unprefixed property. This should ensure the widest possible browser compatibility.

## Suggestions for performance

Some CSS tweaks have been found to offer significant performance improvements. You may want to set these in your application's stylesheet so that they are present from the moment your application loads.

In the examples below, the `transform` and `backface-visibility` properties both have [vendor prefixed](#vendor-prefixes) equivalents.

Suggested tweaks include:

#### Allow the browser to optimise elements that will change size

We found that the performance of resizing widgets via `tweenElementStyle()` could be improved in some cases by applying the following styles, which allows the browser to promote the widgets to their own layer before carrying out the transition. Note that these styles are applied without the `animate` class - in other words, from application startup - otherwise you don't seem to get the benefit.

```css
.centrallyExpandingContentItem {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

#### Promote background images to a separate layer

When an element being animated (a carousel in our case) is placed over the top of a large background image, some devices seem to re-decode the background image before every animation operation on the foreground carousel. This introduces a noticeable delay before the animation begins.

By adding a `translateZ(0)` transform to the background image, the browser puts the image in its own GPU layer and the re-decoding does not occur. Example:

```css
.applicationBackgroundImage {
  transform: translateZ(0);
}
```

#### Tell the browser that you will change size

It is possible to set the `will-change` CSS property to give the browser a hint that some properties of an element will soon change. [According to the documentation](https://developer.mozilla.org/en/docs/Web/CSS/will-change), it must be applied sparingly, with care, and not used to perform premature optimisation. An example of usage would be:

```css
.centrallyExpandingContentItem.focus {
	will-change: width, height;
}
```

## Vendor prefixes

The vendor prefixes that can be applied to `transition`, `transform` and `backface-visibility` are:

* `-webkit-` (WebKit browsers)
* `-moz-` (Mozilla/Gecko browsers)
* `-o-` (Opera browsers)
* `-ms-` (Microsoft browsers, e.g. Xbox One)

For instance, the Mozilla vendor-prefixed version of `transform` is `-moz-transform`. TAL sets the various prefixes automatically when specifying `transition` and `transform` properties as a result of the various animation methods being called, but you will need to set them yourself when following the [performance suggestions](#suggestions-for-performance) above.