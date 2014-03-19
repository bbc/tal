---
layout: default
title: Carousels
---
# Carousels

Carousels provide a handy way to navigate a list of items. They differ from Lists as the items scroll to a focus point rather then a focus point moving over the items.

Imagine a long strip of cardboard with a sequence of pictures drawn on it. If you took a piece of paper and cut a small window in it, then moved the strip of cardboard behind the paper, you would see the pictures scroll by.
This is essentially how the Carousel works.

In TAL Carousels, the 'window' is a div called the 'Mask'. The strip of cardboard is a div within the Mask called the 'Widget Strip'. The pictures drawn onto the cardboard are individual Widgets, or carousel 'Items'. The items are contained within the Widget Strip and may be divs or other elements.

![Carousel]({{site.baseurl}}/img/widgets/carousel.png)

The above diagram shows how the various bits of the carousel fit together. The dotted area is hidden as it lies outside the mask.

Carousels can have be arranged horizontally or vertically, here is a vertical carousel

![Vertical Carousel]({{site.baseurl}}/img/widgets/carousel_example.png)

And here is a view of it's structure in the DOM

![Carousel Structure]({{site.baseurl}}/img/widgets/carousel_structure.png)

## CSS
When you create a carousel, you provide an id to the Carousel constructor. The id of the Mask and Widget Strip divs are derived from the one you provide.
The mask has \_CarouselMask appended and the Widget Strip has \_WidgetStrip appended. In the example above 'simpleVerticalHidingV2Carousel" was provided as the id.
This gives each mask and strip a unique id within the document. In addition there are a number of css classes added to these elements:

* vertical - added to both the mask and strip in vertically oriented carousels
* horizontal - added to both the mask and strip in horizontally oriented carousels
* carouselmask - added to every mask in the document
* carouselwidgetstrip - added to every widget strip in the document
* carouselItem - added to every widget when it is added to a carousel

Some basic styling is required for a carousel to work correctly. These style properties are deliberately not set by default to allow for flexibility in creating style sheets.
#### Mask
The mask needs to have overflow set. In general you'll want this hidden so the strip can flow outside its bounds without visible scroll bars. You might want to set it to something else if modifying animation behaviour or targetting a touch device.
The mask needs to have a fixed length - this is width for a horizontal carousel and height for vertical carousel. This is so that the carousel can efficiently determine which widgets are outside the mask.

#### Widget Strip
The widget strip must have position set to relative to allow movement. Horizontal carousels need whitespace set to nowrap so that the items do not break onto multiple lines at the mask boundaries.

#### Items
For horizontal carousels, items need display set to inline-block, for vertical carousels items should have display set to block - this is so they are laid out correctly.

Below is some example css for generic carousels

{% highlight css %}
.carouselmask {
    overflow: hidden;
}

.carouselwidgetstrip {
    position: relative;
    white-space: nowrap;
}

.carouselwidgetstrip.vertical > .carouselItem {
   display: block;
}

.carouselwidgetstrip.horizontal > .carouselItem {
    display: inline-block;
}
{% endhighlight %}

And some additional, more specific css for the above example

{% highlight css %}
#simpleVerticalHidingV2Carousel_CarouselMask {
    height: 300px;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    background: #DCDCDC;
    color: #1d1d1d;
    text-align: center;
}
{% endhighlight %}
The only essential part of this specific css is the height property, as this is a vertical carousel so the mask needs to have a fixed length.

## Instantiating a carousel
The Carousel takes two parameters in its constructor, an id which will be used when constructing its constituent parts, and an orientation.
Currently carousels can be vertical or horizontal, and these orientations are provided within a property of the Carousel class.
If you do not explicitly provide an orientation the carousel will default to a vertical layout.

{% highlight javascript %}
var carousel = new Carousel('someCarousel', Carousel.orientations.HORIZONTAL);
{% endhighlight %}

## Adding items

Items can be added to the carousel using the standard container interface, for example

{% highlight javascript %}
var carousel = new Carousel('theCarousel');
var widget = new Widget('someItem');
carousel.appendChildWidget(widget);
{% endhighlight %}

In contrast to the old horizontal carousel, the new carousel does not directly support data binding via its constructor. Instead you can use a Binder, which in turn calls appendChildWidget on the Carousel with each data bound widget.

{% highlight javascript %}
var carousel = new Carousel('theCarousel');
var binder = new Binder(someFormatter, someDataSource);
binder.appendAllTo(carousel);
{% endhighlight %}

## Aligning
