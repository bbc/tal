---
layout: default
title: Data Binding
---

# Data Binding

The framework provides a mechanism, 'Data Binding' for constructing complex widgets from data feeds.

Specifically, lists and carousels can be populated based on data provided in an object array.

Data Binding is a multi-stage process.

1. Create a _DataSource_
2. Create a _Formatter_. Its job is to use the information provided by the _DataSource_ to populate a widget
3. Create a widget passing the _Formatter_ to its constructor
4. Bind the _DataSource_ to the widget - the supplied data will now be used by the _Formatter_ and the widget populated

## Creating a DataSource
The _DataSource_ object (antie/datasource) provides an interface for _List_ (or extensions from _List_ such as _HorizontalCarousel_) to obtain data. 

When creating a _DataSource_ you must supply 

1. A component which will take ownership of the data
2. An object extended from antie/class. The object must contain a method that accepts a callback object as a parameter. The callback object contains `onSuccess()` and `onError()` callback functions. The method should invoke the `onSuccess()` callback with an array of data objects if data is obtained successfully, or invoke `onError()` if an error occurs.
3. The name of the method that will fire the callbacks.

This is best illustrated with an example.

Instantiating the DataSource
From within a _Component_:
{% highlight javascript %}
var dataSource = new DataSource(this, new SimpleFeed(), "loadData");
{% endhighlight %}

For this example, we've used a class called _SimpleFeed_ which contains some static data. There's no way this can fail to load, so we ignore the `onError()` callback.

{% highlight javascript %}
require.def("myapp/simplefeed",
    [
        "antie/class"
    ],
    function(Class) {
        return Class.extend({
            // You will probably want to do something
            // more useful then returning static data.
            // An array of objects is expected.
            loadData : function(callbacks) {
                callbacks.onSuccess(
                    [
                        {
                            "id":"1",
                            "title":"cherry"
                        },
                        {
                            "id":"2",
                            "title":"strawberry"
                        },
                        {
                            "id":"3",
                            "title":"peach"
                        },
                        {
                            "id":"4",
                            "title":"apple"
                        },
                        {
                            "id":"5",
                            "title":"melon"
                        }
                    ]
                );
            }
        });
    });
{% endhighlight %}

## Creating a Formatter

A _Formatter_ must provide the `format()` method. `format()` should return a widget that makes up a single item for a _List_ or _Carousel_.

An item can be something simple like a _Button_ (see below), or a more complicated composite such as a _List_, _Carousel_ or _Container_ full of widgets.

`format()` is supplied with an iterator with which to access the data it will use. 
You should call iterator.next() within the `format()` function to acquire a data item (one of the objects in the array defined by the feed).

Here is a simple formatter that creates a labeled button for each item in the _SimpleFeed_:

{% highlight javascript %}
require.def("myapp/simpleformatter",
    [
        "antie/formatter",
        "antie/widgets/label",
        "antie/widgets/button"
    ],
    function(Formatter, Label, Button) {
        return Formatter.extend({
            format : function (iterator) {
                var button, item;
                item = iterator.next();
                button = new Button("fruit" + item.id);
                button.appendChildWidget(new Label(item.title));
                return button;
            }
        });
    }
);

{% endhighlight %}

## Data binding with a _HorizontalCarousel_

Now to tie them together in a component. This example creates a _HorizontalCarousel_, but a plain _List_ will work in the same way.

{% highlight javascript %}
require.def("myapp/simplecarouselcomponent",
    [
        "antie/widgets/component",
        "antie/datasource",
        "antie/widgets/horizontalcarousel",
        "myapp/simpleformatter",
        "myapp/simplefeed"

    ],
    function (Component, DataSource, HorizontalCarousel, SimpleFormatter, SimpleFeed) {
        return Component.extend({
            init: function() {
                var self, simpleFormatter, simpleFeed;
                
                // make sure you call _super()!
                this._super("simplecarouselcomponent");
                self = this;
                
                // Create a new formatter and feed
                simpleFormatter = new SimpleFormatter();
                simpleFeed = new SimpleFeed();
                
                // Create a DataSource, this uses the feed to get data and presents it to the formatter
                this._dataSource = new DataSource(this, simpleFeed, "loadData");
                
                // Create a new carousel with the formatter
                this._carousel = new HorizontalCarousel("simplecarousel", simpleFormatter);
                
                // Add it to the component
                this.appendChildWidget(this._carousel);
                
                // We want to rebind every time the component is pushed, so listen for beforerender.           
                this.addEventListener(
                    "beforerender", 
                    function(ev) { 
                        self._onBeforeRender(ev); 
                    }
                );
            },
            _onBeforeRender: function(ev) {
                // do the bind (and build the carousel's items)
                this._carousel.setDataSource(this._dataSource);
            }
        });
    }
);
{% endhighlight %}

In the example, the DataSource is bound to the widget after it has been constructed. It is possible to pass the dataSource to the widget as a third parameter in its constructor, but it is more common to bind on `beforerender` to ensure widgets are reconstructed if the component is hidden and reshown.

## Data binding events

_List_ and any extensions of _List_ fire the following three events related to data binding:

| Event name         | Event description      |
| ------------------ | ---------------------- |
| `beforedatabind`   | Fired just before before the load method is called on a DataSource. |
| `databound`        | Fired when data has loaded and any items generated by the _Formatter_ have been added. This event has an `iterator` property giving you a reference to the data that has been bound. *Note:* You will need to `reset()` the iterator to read all the data. |
| `databindingerror` | Fired if there is an exception or non-success response whilst performing any network requests. |

## Storing bound data for later use

If you would like to associate data with one of the created widgets for later retrieval, you can use the `setDataItem()` method on a _Widget_ from within a _Formatter_. It can be retrieved by calling `getDataItem()`.

## Focus issues when data binding

The framework will not set default focus on a widget which is not 'focussable', i.e. one which is not a _Button_ or does not contain buttons.

As data bound widgets are initially empty, when you need default focus to fall on a data bound widget, you may need to manually set focus post bind in some circumstances.

This can be done using the `setActiveChildWidget()` method of _Component_ or a higher level _Container_ within a function that listens for the `databound` event on the widget in question.

