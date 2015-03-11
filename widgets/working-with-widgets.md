---
layout: widgets
title: TAL | Widgets | Working With Widgets
---

# Working With Widgets

<p class="lead">The TV Application Layer provides a number of ready-made widgets to help you build your application interface.
You can use these widgets out-of-the-box, or extend them for re-use in your applications.</p>

This page lists all the framework widgets, but there are some other important topics relating to widgets:

* [Media Playback](media-playback.html)
* [Focus Management](focus-management.html)
* [Data Binding](data-binding.html)


## Widget

This is the base widget, all other widgets are subclasses of this.

See [widget.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.Widget.html).

## Container

The super class for all widgets that can contain other widgets.

See [container.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.Container.html).

## Component

A dynamically loadable re-usable block of UI. See [Components](../overview/components.html) for detailed documentation.

See [component.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.Component.html) for the Javascript documentation.

## ComponentContainer

A placeholder into which to load Components. See [Components](../overview/components.html) for detailed documentation.

See [componentcontainer.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.ComponentContainer.html) for the Javascript documentation.

## Button

A UI element that can obtain spatial navigation focus. See the [focus management](focus-management.html) overview.

The button widget is the only widget that is currently able to receive focus.
When a button is focused, pressing the VK_ENTER key will fire a `select` event.

![Button]({{site.baseurl}}/img/widgets/button.png)

A *Button* usually contains either a *Label* , *Image* or *Container*
but could contain any component (It does not make sense to put anything inside
a button that deals with navigation though). 

{% highlight javascript %}
var okButton = new Button("okButton");
var okButtonText = new Label("okButtonLabel", "ok");
okButton.appendChildWidget(okButtonText);

var cancelButton = new Button("cancelButton");
var cancelButtonText = new Label("cancelButtonLabel", "cancel");
cancelButton.appendChildWidget(cancelButtonText);
{% endhighlight %}

See [button.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.Button.html) for the Javascript documentation.

See [Creating a Formatter](data-binding.html#Creating_a_Formatter) to learn how to create a button using a formatter.

## Label

A UI Text element.

See [label.js]({{site.baseurl}}//jsdoc/symbols/antie.widgets.Label.html) for the Javascript documentation.

## Image

An image.

See [image.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.Image.html) for the Javascript documentation.

## List

The *List* widget holds a linear collection of UI elements. It has two
direct subclasses *HorizontalList* and *VerticalList*. As the *List* has
no intrinsic styling, the only difference between a *HorizontalList* and
a *VerticalList* is their response to user input. A *HorizontalList* is
navigated with left and right, and a *VerticalList* is navigated with up
and down.

![Button]({{site.baseurl}}/img/widgets/list.png)

You can either fill a List with child UI elements directly: 

{% highlight javascript %}
list.appendChildWidget(new Button('button_id'));
{% endhighlight %}     

or associate a *DataSource* with a *List* to populate list data from 
an array object: (see [Data Binding](data-binding.html)).

{% highlight javascript %}
var verticalList = new VerticalList("verticalList", formatter, dataSource);
{% endhighlight %} 

See also:
* [Focus Management]({{site.baseurl}}/widgets/focus-management.html) -- focus handling in a *List*
* [list.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.List.html) -- Javascript documentation.

## ListItem

Wrapper widget for list items when the list's render mode is *RENDER_MODE_LIST*.

See [listitem.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.ListItem.html) for the Javascript documentation.

## HorizontalList

A list where items are navigated between using `VK_LEFT` and `VK_RIGHT`.

![Horizontal List]({{site.baseurl}}/img/widgets/horizontallist.png)

See [horizontallist.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.HorizontalList.html) for the Javascript documentation.

## VerticalList

A list where items are navigated between using `VK_UP` and `VK_DOWN`.

![Vertical List]({{site.baseurl}}/img/widgets/verticallist.png)

See [verticallist.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.VerticalList.html) for the Javascript documentation.

## Grid

A 2D grid of containers which can be navigated between using `VK_LEFT`,
`VK_RIGHT`, `VK_DOWN` and `VK_UP`.

See [grid.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.Grid.html) for the Javascript documentation.

## HorizontalCarousel

A carousel is a sideways scrolling list, in which an item can be focused
using `VK_LEFT` and `VK_RIGHT`. The list elements are scrolled as the
user navigates, so that the focused element remains in the centre of the
carousel.

Carousels can have various wrap modes:

* `WRAP_MODE_NONE` -- The carousel is **bookended** - you can't navigate through all elements in a full circle
* `WRAP_MODE_NAVIGATION_ONLY` -- You can circle through all elements, however there is a visual break at the end of the carousel before you move back to the first element
* `WRAP_MODE_VISUAL` -- You can circle through all elements, and items at the beginning of the carousel are visible from the end of the carousel, so it forms a continuous loop

The default setting is `WRAP_MODE_VISUAL`. You can set the wrap mode using:
    horizontalCarousel.setWrapMode(HorizontalCarousel.WRAP_MODE_NONE);

Carousels are designed to be constructed via [Data Binding](data-binding.html)

![Horizontal Carousel]({{site.baseurl}}/img/widgets/horizontalcarousel.png)

See [horizontalcarousel.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.HorizontalCarousel.html) for the javascript documentation.

## Media

Video and audio playout. Note: Do not construct a *Media* widget directly.
Use `Device.createPlayer(...)`

See [Media Playback](media-playback.html) for more details, and [media.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.Media.html) for
the javascript documentation.

## HorizontalProgress

Indicates a position via a horizontal progress bar (must be styled by the application).

![Horizontal Progress]({{site.baseurl}}/img/widgets/horizontalprogress.png)

See [horizontalprogress.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.HorizontalProgress.html).

## HorizontalSlider

Allows a value to be set by sliding a control along a slider using `VK_LEFT` and `VK_RIGHT`.

See [horizontalslider.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.HorizontalSlider.html) for the javascript documentation.

## ScrubBar

Extends *HorizontalSlider* to also allow the indication of a buffered range.

![Scrub Bar]({{site.baseurl}}/img/widgets/scrubbar.png)

See [scrubbar.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.ScrubBar.html) for the javascript documentation.

## KeyBoard

Versatile on-screen keyboard, with keys laid out on a grid. Note that to enable focus on the keyboard keys, you must first set the active child key, for example:

`myVirtualKeyBoard.setActiveChildKey('A')`

![Key Board]({{site.baseurl}}/img/widgets/keyboard.png)

See [keyboard.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.Keyboard.html) for the Javascript documentation.

## TextPager

Allows large blocks of text to be paged.

![Text Pager]({{site.baseurl}}/img/widgets/textpager.png)

See [textpager.js]({{site.baseurl}}/jsdoc/symbols/antie.widgets.TextPager.html) for the javascript documentation.

# Creating New Widgets

To create a new widget, extend the base *Widget*, *Container* or another one of the built-in widgets.

You must implement the `render(device)` method, which must return an output element (generated from
the *createX* (e.g. `createContainer`) methods implemented by the provided device. If your widget
extends *Container* you are also responsible for rendering the children (by calling their render
methods).

The `render()` method must also set the `outputElement` property on the widget with the same value
as it returns. For performance reasons, you should not re-render a widget if it already has an
`outputElement` set, instead you should update this element.

An example implementation of the render method is:

{% highlight javascript %}
  if(!this.outputElement) {
    this.outputElement = device.createContainer(this.id, this.getClasses(), "#");
      for(var i=0; i<this._childWidgetOrder.length; i++) {
        device.appendChildElement(this.outputElement, this._childWidgetOrder[i].render(device));
      }
    }
  return this.outputElement;
{% endhighlight %}
