---
layout: default
title: Events
---
# Events

<p class="lead">The Framework implements its own event system which isolates the application from event differences across devices and provides additional useful events.</p>

## Listening for Events
You can listen for an event by attaching an event listener function to any widget in your UI. This event listener will be executed for all events of the given type that have been raised by a descendant widget in the tree.
{% highlight javascript %}
widget.addEventListener("select", function(evt) { ... });
{% endhighlight %}

## Firing Events
You can fire custom events in your application. Note: you should not fire an event with the same type as one that already exists within the Framework, as the Framework itself may be listening on these.

{% highlight javascript %}
widget.bubbleEvent(new Event("myeventtype"));
{% endhighlight %}

You may also broadcast events. Note: use this sparingly, if you have a large complex UI graph, broadcasting an event may be slow:

{% highlight javascript %}
widget.broadcastEvent(new Event("myeventtype"));
{% endhighlight %}

## Custom Events

{% highlight javascript %}
/**
 * @fileOverview <DESCRIPTION>
 */
require.def('yourapplication/appui/events/yourevent',
        ['antie/events/event'],
        function(Event) {
                /**
                 * <DECRIPTION>
                 *
                 * @name yourapplication.appui.events.YourEvent
                 * @class
                 * @extends antie.events.Event
                 * @param {String} yourParam An additional parameter.
                 */
                return Event.extend(/** @lends yourapplication.appui.events.YourEvent.prototype */ {
                        /**
                         * @constructor
                         * @ignore
                         */
                        init: function init (yourParam) {
                                this.yourParam = yourParam;
                                init.base.call(this, "youreventtype");
                        }
                });
        }
);
{% endhighlight %}

## Event Lifecycle
Unlike DOM events, Framework events are normally one-way - there is no capture phase. Events are fired by their source and pass up through the widget graph until they hit the root widget of the application. The source of events is dependent on their type - see below for more details on each event type.

During event propagation, you can prevent the event from bubbling to the next level of the UI graph by calling the `stopPropagation()` method on the event, e.g:

{% highlight javascript %}
widget.addEventListener("select", function(evt) {
         evt.stopPropagation();
});
{% endhighlight %}

## Event Types
The framework contains many event types, below is a description of them:

### KeyEvent
KeyEvents (`keyup`, `keypress` and `keydown`) are bubbled from the currently focused widget. For each remote button press the application fires a single keydown event, multiple keypress events (whilst the button is held down) and a single `keyup` event.

KeyEvents have a `keyCode` property that contains the virtual key code of the button pressed (e.g. `KeyEvent.VK_BACK`). See the KeyEvent class for a full list of virtual key codes. Note: not all keys will be available on all devices. As a minimum you can rely on 5-point navigation (`VK_UP`, `VK_DOWN`, `VK_LEFT`, `VK_RIGHT` and `VK_ENTER`).

### SelectEvent
SelectEvents (`select`) are fired from the focused Button widget when `VK_ENTER` is pressed.

### ComponentEvent
ComponentEvents (`load`, `beforerender`, `beforeshow`, `aftershow`, `beforehide`, `afterhide`) are fired during different parts of a [component's lifecycle](components.html#component_lifecycle). They are fired from the Component they relate to.

### FocusEvent, BlurEvent, FocusDelayEvent
FocusEvents (`focus`), BlurEvents (`blur`) and FocusDelayEvents (`focusdelay`) occur when focus is moved via the spatial navigation feature of the framework. When a widget obtains focus it will fire a FocusEvent, when it loses focus it will fire a BlurEvent. Buttons also fire a FocusDelayEvent one second after receiving focus, to allow you to execute code if the user pauses over a Button.

It is important to note that multiple BlurEvents and FocusEvents can be fired for a single spatial navigation movement. Consider the following UI:

    VerticalList (root, focused)
    |-- HorizontalList
    |   |-- Button1
    |   |-- Button2
    |--Button3 (focused)

When UP is pressed, the UI will become:

    VerticalList (root, focused)
    |-- HorizontalList (focused)
    |   |-- Button1 (focused)
    |   |-- Button2
    |--Button3

In this example, a BlurEvent will be fired on Button3 (as it loses focus) and a FocusEvent will be fired on Button1 and another on HorizontalList (as both become part of the focused path from root to focused Button). No events will be fired on VerticalList as its state has not changed (it was and still is in the focus path).

### DataBoundEvent
DataBoundEvents are fired when data is bound to lists. There are 3 types of these events: `beforedatabind`, `databound` and `databindingerror`:

The `beforedatabind` event is fired from the List before the `load()` method is called on the DataSource.
The `databound` event is called after the data has been loaded and any resulting widgets have been appended to the List. It contains an iterator property giving you a reference to the data that has been bound (note: you will need to `reset()` the iterator to read all the data).
The `databindingerror` event is fired if there is an exception or non-success response whilst performing any network requests.
See [Databinding Events](../widgets/data-binding.html#data_binding_events) for more details.

### MediaEvent, MediaErrorEvent, MediaSourceErrorEvent
MediaEvents are fired by Media widgets. There are multiple types, mirroring the HTML5 MediaElement events (see mediaevent.js for a list). Please note that not all devices will support all event types. You can rely on a minimum of: `loadedmetadata`, `play`, `playing`, `canplay`, `pause`, `waiting`, `ended` and `timeupdate`.

MediaErrorEvents are fired when an error occurs in the Media widget that is not specific to a source. These mirror error events on the `<video>` and `<audio>` elements in HTML5.

MediaSourceErrorEvents are fired when an error occurs with an individual media source. These mirror error events on the `<source>` elements in HTML5. They contain 2 properties, url which contains the URL of the source which caused the error, and last, which is boolean true if it is the last source available.

### NetworkStatusChangeEvent
This event (`networkstatuschange`) is fired when the device reports that the network status has changed (i.e. disconnected or reconnected). The event has a `networkStatus` property that has the value of `NetworkStatusChangeEvent.NETWORK_STATUS_OFFLINE` or `NetworkStatusChangeEvent.NETWORK_STATUS_ONLINE`.

### Other Events
There are a number of other widget-specific events used by the framework, these are:

`PageChangeEvent` - this event may be fired by yourself when you change 'page'. This is normally used to signify that a navigation event is reported to a stats reporting system (e.g. *[iStats](http://www.bbc.co.uk/frameworks/istats)*). If used it is the application's responsibility to listen for these.

`SelectedItemChangeEvent` - this event is fired by List widgets when the active child widget changes.

`SliderChangeEvent` - this event is fired when the valid of a HorizontalSlider is changed by a user releasing `VK_LEFT` or `VK_RIGHT`.

`TextChangeEvent` - this event is fired from a Keyboard widget when the entered text has changed.

`TextPageChangeEvent` - this event is fired from a TextPager widget when the user pages the text up or down.
