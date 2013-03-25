---
layout: default
title: Widgets | Focus Management
---

# Focus Management

## Introduction

Spatial navigation (i.e. navigating around the UI via 5-point navigation) is 
handled for you by the framework if you make use of the _VerticalList_, 
_HorizontalList_ and _Grid_ widgets (or subclasses of them such as 
_HorizontalCarousel_).

* _VerticalList_ consumes up and down key events, preventing bubbling of the 
event to the list's parent widget if it successfully moved the focus to the 
next/previous item in the list
* _HorizontalList_ does the same for left and right key events
* _Grid_ consumes all directional (up, down, left and right) key events

Events that are not consumed bubble up through the Widget tree (not the DOM), until a higher-level widget can consume them. By nesting both Vertical and Horizontal lists within each other, you can build up a complex UI. 

For more details about events, please see the [Events]({{site.baseurl}}/overview/events.html) section.

## Concept of Active and Focused

When discussing spatial navigation it is important to understand the notion of a widget's active child.

### Consider the following UI:

![Diagram 1]({{site.baseurl}}/img/spatial_diagram_1.gif)

This can be described as the following UI graph:

    VerticalList
    |-- HorizontalList
    |   |-- Button1
    |   |-- Button2
    |--Button3


### Let's say the default focus is on the button at the bottom of the screen:

![Diagram 2]({{site.baseurl}}/img/spatial_diagram_2.gif)

The focus/active state will be:

    VerticalList (root, active, focused)
    |-- HorizontalList
    |   |-- Button1 (active)
    |   |-- Button2
    |--Button3 (active, focused)
    
By default the first child appended to a widget that is focusable (i.e.  has a descendant widget that is an enabled button) will become the  active child.

### Pressing VK_UP

When UP is pressed, the _KeyEvent_ is bubbled from the focused _Button_, `Button3` up through the tree. In this case, the event will be consumed by `VerticalList`, which can change it's active child to the first item, `HorizontalList`.

    VerticalList (root, active, focused)
    |-- HorizontalList (active)
    |   |-- Button1 (active)
    |   |-- Button2
    |--Button3
    
At this point the framework detects that there is a path of active widgets from the root, to a leaf _Button_, `Button1`. It then sets the focus state on all widgets in this path:

    VerticalList (root, active, focused)
    |-- HorizontalList (active, focused)
    |   |-- Button1 (active, focused)
    |   |-- Button2
    |--Button3

i.e. focus state always moves to the active child. The UI will now look like:

![Diagram 3]({{site.baseurl}}/img/spatial_diagram_3.gif)
