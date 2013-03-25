---
layout: default
title: A first component
---
[Launching the application]: applicationclass.html
[Example layout and basic style]: layout.html

# A first component

This section describes a minimal 'Hello World' component. It:

* Calls the constructor of Component, passing an ID to it.
* Creates a new button widget with a 'Hello World' Label appended to it
* Before it is rendered, adds this label to itself (and hence the application)
* Fires the ready() method of the application module created in the previous section the first time it is shown

{% highlight javascript %}
require.def("sampleapp/appui/components/simple",
    [
        "antie/widgets/component",
        "antie/widgets/button",
        "antie/widgets/label"
    ],
    function (Component, Button, Label) {
        
        // All components extend Component
        return Component.extend({
            init: function () {
                var self, label, button;

                self = this;
                // It is important to call the constructor of the superclass
                this._super("simplecomponent");
                
                // Hello World
                label = new Label("Hello World");
                this._button = new Button();
                this._button.appendChildWidget(label);
                
                this.addEventListener("beforerender", function (ev) {
                    self._onBeforeRender(ev);
                });

                // calls Application.ready() the first time the component is shown
                // the callback removes itself once it's fired to avoid multiple calls.
                this.addEventListener("aftershow", function appReady() {
                    self.getCurrentApplication().ready();
                    self.removeEventListener('aftershow', appReady);
                });
            },

            // Appending widgets on beforerender ensures they're still displayed
            // if the component is hidden and subsequently reinstated.
            _onBeforeRender: function () {
                this.appendChildWidget(this._button);
            } 
        });
    }
);
{% endhighlight %}

Next page [Example layout and basic style][]

Previous page [Launching the application][]