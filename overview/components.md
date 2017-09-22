---
layout: default
title: Components
---
[Sequence Diagram]: {{site.baseurl}}/img/overview/components_sequence.png

# Components

<p class="lead">Components are UI modules that enable re-use within your application.</p>

Components are the method used by the Framework to provide modular re-usable sections of UI. They make use of *RequireJS* to allow blocks of UI to either be lazily loaded when first needed, or be packaged into the initial JavaScript downloaded when the User-Agent starts the application.

Components act as singletons - the framework only allows one instance of a component to be onscreen at any one time, this means a component's init(...) method will only be called once per session. If you wish to have multiple, but similar components on-screen simultaneously, you can subclass Components in the same manner as any other widget.

ComponentContainers are most often found at the top-level of an application, however they may be placed anywhere in the UI graph, including within other Components.

Note: You should NEVER load a component via the dependency list of a RequireJS module (other than when subclassing a Component), doing so will prevent the component from loading correctly. You should instead use the methods provided on the ComponentContainer widget (see [Showing a Component](#showing-a-component)).

## Defining a Component

To define a component, create a module in your application's appui/components folder extending the Component widget, e.g:
{% highlight javascript %}
/**
 * @fileOverview <DESCRIPTION>
 */
require.def("<APPNAME>/appui/components/<COMPONENT>",
    [
        "antie/widgets/component"
    ],
    function (Component) {
        /**
         * <DESCRIPTION>
         * @name <APPNAME>.appui.components.<COMPONENT>
         * @class
         * @extends antie.widgets.Component
         * @requires ...
         */
        return Component.extend(/** @lends <APPNAME>.appui.components.<COMPONENT>.prototype */{
            init: function init () {
                var self = this;

                init.base.call(self, "<COMPONENTID>");

                // Add component lifecycle event listeners
                this.addEventListener("load", function(ev) { self._onLoad(ev); });
                this.addEventListener("beforerender", function(ev) { self._onBeforeRender(ev); });
                this.addEventListener("beforeshow", function(ev) { self._onBeforeShow(ev); });
                this.addEventListener("aftershow", function(ev) { self._onAfterShow(ev); });
                this.addEventListener("beforehide", function(ev) { self._onBeforeHide(ev); });
                this.addEventListener("afterhide", function(ev) { self._onAfterHide(ev); });
            },
            _onLoad: function(ev) {
                // Called when component is first loaded.
            },
            _onBeforeRender: function(ev) {
                // Called before a component is rendered.
                // This is the best place to set data-specific content.
            },
            _onBeforeShow: function(ev) {
                // Called after the component is rendered but before it is visible.
            },
            _onAfterShow: function(ev) {
                // Called after the component is visible.
            },
            _onBeforeHide: function(ev) {
                // Called before the component is hidden.
            },
            _onAfterHide: function(ev) {
                // Called after the component is hidden.
            }
        });
    }
);
{% endhighlight %}

## Showing a Component

You can show a component using the `ComponentContainer.show(...)` method or `pushComponent(...)` methods (see below about [Using ComponentContainer History](#using-componentcontainer-history)).

For example, to load a component defined in "helloworld/appui/components/hellocomponent.js" you would first create a ComponentContainer into which to load it.

There are 2 methods to do this:

- manually:
{% highlight javascript %}
var container = new ComponentContainer("topleftContainer");
application.getRootWidget().appendChildWidget(container);
{% endhighlight %}
- via the Application's addComponentContainer shortcut, which adds a ComponentContainer to the root of the application:
{% highlight javascript %}
var container = application.addComponentContainer("topLeftContainer");
{% endhighlight %}

You then tell your ComponentContainer to load and show the hellocomponent:

{% highlight javascript %}
container.show("helloworld/appui/components/hellocomponent");
{% endhighlight %}

The `show` method takes an optional second argument. This argument can be any arbitrary object and is passed as the "args" property of the beforerender, beforeshow and aftershow events on the loaded Container. This allows you to reuse your component, initialising the UI with different data depending on different arguments (see [Using ComponentEvents](#using-componentevents)).

An example would be to have a dialog component that has a different title and text:
{% highlight javascript %}
container.show("helloworld/appui/components/dialogcomponent",
                                {title: "Do you want to continue?", text: "Yes/OK"});

container.show("helloworld/appui/components/dialogcomponent",
                                {title: "Warning: Hull breach in progress", text: "Sound the alarm"});
{% endhighlight %}

The same can be achieved by using the {{Application}} object and using the show component shortcut:
{% highlight javascript %}
application.showComponent("topLeftContainer", "helloworld/appui/components/dialogcomponent",
                                              {title: "Info: Alarm active", text: "Cancel Alarm"});
{% endhighlight %}

You can simplify the process of adding a ComponentContainer and loading a Component into it using:
{% highlight javascript %}
var container = application.addComponentContainer("topLeftContainer",
                                                  "helloworld/appui/components/hellocomponent",
                                                  {text: "Hello World!"});
{% endhighlight %}

## Querying a ComponentContainer

You can obtain a details about the currently loaded Component within a ComponentContainer using:
{% highlight javascript %}
var component = container.getContent();
var module = container.getCurrentModule();
var args = container.getCurrentArguments();
{% endhighlight %}


## Hiding a Component

To hide a Component you can call the hide() method on either the Component or the ComponentContainer which holds it, e.g.
{% highlight javascript %}
container.hide();
{% endhighlight %}
Or within a Component's code:
{% highlight javascript %}
this.hide();
{% endhighlight %}

Note: After calling `hide()` the ComponentContainer will be empty. If you wish to return to the previous loaded Component, use the ComponentContainer history functionality.

## Using ComponentContainer History

ComponentContainers have the ability to maintain a history stack of loaded Components along with the arguments passed to them when they were shown. To maintain history, instead of calling `show()`, call `pushComponent()` (with the same arguments), e.g.
{% highlight javascript %}
container.pushComponent("helloworld/appui/components/hellocomponent", {text: "Hello World!"});
container.pushComponent("helloworld/appui/components/hellocomponent", {text: "Hello Universe!"});
{% endhighlight %}

Due to the singleton design of Components there is very little overhead in maintaining the history.

When you wish to return to the previous Component, call the back() method on the ComponentContainer:
{% highlight javascript %}
container.back();
{% endhighlight %}

## Maintaining State Within the History

You may find that you need to persist state information alongside the Component within the history, for example the currently focused Button, so that when you return to the Component, you can restore the Component to the same state as it was before it was pushed on to the history stack.

The framework calls a getCurrentState() method on the Component before pushing in on to the history stack. You should implement this method in your Component and return any data you wish to persist.

{% highlight javascript %}
getCurrentState: function() {
        return this.getCurrentApplication().getFocussedWidget();
}
{% endhighlight %}

When the Component is shown again via a call to back(), this returned data will be passed to the beforerender, beforeshow and aftershow event handlers in the state property of the event object.

{% highlight javascript %}
this.addEventListener("aftershow", function(evt) {
        var previouslyFocusedButton = evt.state;
        previouslyFocusedButton.focus();
});
{% endhighlight %}

## Using ComponentEvents

As mentioned above, using events (namely ComponentEvent) are critical for successful use of Components. As Components are singletons, events are the only way your component can be informed that it must update its content with new data, etc. each time it is shown.

The important events are:

### load
This event is fired once, the first time a Component is loaded. At this point the Component will have been initialised but not placed into the UI graph, i.e. this event will not bubble.

### beforerender
This event is fired each time a Component is shown. The Component will be in the UI graph (its parent being a ComponentContainer), but it will not yet have been rendered (via the render(...) method).

_Note: If you wish to bind data to any widgets within a Component, beforerender is the correct place to do it. You should also update any Labels, Images, etc. with any content that varies based on the args property of this event._  

### beforeshow
This event is fired each time a Component is shown. The Component will be in the UI graph and will have been rendered (outputElement will not be null). However it will not be visible (e.g. DOM element will have visibility: hidden)

### aftershow
This event is fired each time a Component is shown. This Component will be in the UI graph, will have been rendered, and will be visible to the user.

_Note: Either beforeshow or aftershow are the recommended places for overlays/modal Components to capture focus._  

### beforehide
This event is fired each time a Component is hidden. The Component will be in the UI graph, will have been rendered, and will currently be visible to the user.

_Note: You may call `preventDefault()` on this event to prevent the rendered output from being removed from the DOM. This is particularly useful if you wish to cross-fade, etc., however you MUST ensure the Component's DOM element is removed before the Component is shown again._  

### afterhide
This event is fired each time a Component is hidden. The Component will  be in the UI graph, but will have been remove from the output (unless `preventDefault()` was called in a beforehide listener).

## Component Lifecycle

The following sequence diagram illustrates loading Component A (defined in Module A) into a ComponentContainer using the `Application.showComponent(...)` shortcut. The application then uses `showComponent(...)` again to show Component B within the same ComponentContainer. Later the application shows Component A again.

Note how `ComponentContainer.showComponent(...)` is asynchronous. If the module has not yet been loaded, it calls RequireJS which loads the module asynchronously. If the module has already been loaded, `showComponent(...)` begins the process of showing the component asynchronously and returns instantly.

![Sequence Diagram][]
