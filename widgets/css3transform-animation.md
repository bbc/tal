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
2. [Adding CSS Transitions](#configuring-css-transitions) to your application's stylesheets.

## Caveats

As the value of this animation modifier is still being proven, the following caveats apply. Some of these may change in the future as the modifier improves.

* You must [specify transitions in CSS yourself](#configuring-css-transitions), for the reasons outlined in [Rationale](#rationale). If you will also be using the other animation modifiers, this means duplicating details such as animation duration and easing between code and CSS. This may change in the future, allowing all animation options to be specified in code, in line with the other animation modifiers.
* Multiple animation operations applied to the same widget in quick succession are not queued or merged; the last one simply "wins". This should not be problematic if you are only animating [TAL's built-in Carousels](carousel.html), as these cancel the previous animation before triggering a new one, but it may cause trouble if you're performing custom animations.
* Elements being hidden via `hideElement()` are hidden without animation and the completion callback is called immediately. This is to work around a bug where our application is calling `hideElement()` then showElement()` on the same element in quick succession.

## Rationale

The existing animation modifiers - _styletopleft_ and _css3_ - are quite heavyweight in terms of JavaScript that must be executed for every animation operation. This can lead to poor animation performance on devices that have weak CPU capabilities but relatively strong graphics hardware.

By contrast, this animation modifier is intended to be lightweight in terms of the code it will execute, depending more heavily on efficient CSS transforms. This means [there are some caveats to its use](#caveats).

This modifier is particularly strong when it comes to moving widgets around the screen. The other animation modifiers achieve this by manipulating the `top` and `left` properties of the underlying DOM element, which results in Paint operations by the browser. This modifier achieves smoother animation by using CSS Transforms with the `translate3d()` function. Compatible devices are able to promote the element being animated to a separate layer and accelerate its movement using the GPU, resulting in improved performance. This is especially relevant when scrolling TAL's [Carousel widget](carousel.html).

Widget resize and opacity operations also benefit from lighter-weight JavaScript, meaning less code has to run while the device is running the transition.

## Animation flow

When an animation is requested using one of the [framework's animation methods](animation.html), the following process is followed:

* The `animate` class is added to the element being animated, in order to enable the [specified CSS transitions](#configuring-css-transitions).
* Appropriate style properties are set on the element to move it to its final state: the `transform` property utilising `translate3d()` for moving position, and `width`, `height` or `opacity` properties for size and opacity changes.
* The framework listens for the `transitionend` DOM event (and vendor-specific equivalents) to signal the end of the animation, and when it arrives:
  * Removes the `animate` class. This ensures that subsequent changes are not animated by accident.
  * For position changes only: At the end of the transition, the element is moved to its final position via `top` or `left` properties, and the `transform` is reset. This ensures that other elements flow correctly with respect to the element being moved.
  * Note that, if no animation occurs because the transition has not been configured in CSS, no `transitionend` event will fire and these cleanup steps will not happen. You should therefore ensure that all elements you expect to be animated have CSS transitions configured.

## Configuring CSS Transitions

In order to minimise the number of style properties set by JavaScript, this animation modifier relies on the `transition` properties for the animation - duration, easing and the properties that they apply to - to be set outside of TAL, using stylesheets loaded as part of your application.

The `transition` properties must be set in a selector including the `animate` class, which the code in this animation modifier will add to indicate an animation is required. This avoids transitions being applied where animation is supposed to be skipped, or on devices configured to use one of the other animation modifiers.

For best results across different devices, it is important to set the vendor-specific versions of the `transition` properties as well as the base one. You can make this easier by using a tool such as [Sass](http://sass-lang.com/) to create macros/mixins.

#### Sample carousel transition

Here is some example CSS for controlling the transition on a carousel:

```css
.tertiaryContentComponent__widgetStrip.animate {
  -webkit-transition: transform 500ms cubic-bezier(0.39, 0.575, 0.565, 1);
  -moz-transition: transform 500ms cubic-bezier(0.39, 0.575, 0.565, 1);
  -o-transition: transform 500ms cubic-bezier(0.39, 0.575, 0.565, 1);
  transition: transform 500ms cubic-bezier(0.39, 0.575, 0.565, 1); 
}
```

*Tip:* The mapping between the easing strings used in TAL (e.g. "easeInOutQuart") and their CSS expressions [can be found in the source code](https://github.com/fmtvp/tal/blob/master/static/script/devices/anim/css3/easinglookup.js). For example, this one is "easeOutSine".

#### Sample opacity transition

And for allowing all TAL Components to fade in with their default timing:

```css
.widget.component.animate {
  -webkit-transition: opacity 840ms linear;
  -moz-transition: opacity 840ms linear;
  -o-transition: opacity 840ms linear;
  transition: opacity 840ms linear;
}
```

#### Sample expansion transition

And for allowing a TAL widget to be resized smoothly using `tweenElementStyle()`:

```css
.centrallyExpandingContentItem.animate {
  -webkit-transition: width 600ms cubic-bezier(0.445, 0.05, 0.55, 0.95), height 600ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
  -moz-transition: width 600ms cubic-bezier(0.445, 0.05, 0.55, 0.95), height 600ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
  -o-transition: width 600ms cubic-bezier(0.445, 0.05, 0.55, 0.95), height 600ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
  transition: width 600ms cubic-bezier(0.445, 0.05, 0.55, 0.95), height 600ms cubic-bezier(0.445, 0.05, 0.55, 0.95);
}
```

## Suggestions for performance

Some CSS tweaks have been found to offer significant performance improvements. These include:

#### Allow the browser to optimise elements that will change size

We found that the performance of resizing widgets via `tweenElementStyle()` could be improved in some cases by applying the following styles, which allows the browser to promote the widgets to their own layer before carrying out the transition. Note that these styles are applied without the `animate` class - in other words, from application startup - otherwise you don't seem to get the benefit.

```css
.centrallyExpandingContentItem {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
}
```

#### Promote background images to a separate layer

When an element being animated (a carousel in our case) is placed over the top of a large background image, some devices seem to re-decode the background image before every animation operation on the foreground carousel. This introduces a noticeable delay before the animation begins.

By adding a `translateZ(0)` transform to the background image, the browser puts the image in its own GPU layer and the re-decoding does not occur. Example:

```css
.applicationBackgroundImage {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -o-transform: translateZ(0);
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