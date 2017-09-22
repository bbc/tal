---
layout: default
title: Launching the application
---
[Component system]: {{site.baseurl}}/overview/components.html
[concepts]: {{site.baseurl}}/overview/concepts.html
[A first component]: firstcomponent.html
[Creating an index]: createanindex.html

# Launching the application

Before continuing, it would be worthwhile to familiarise yourself with some [concepts][] used in the framework, including the [Component system][].

## antie/application

Every antie application launches from a javascript require module.
This module must be an extension of antie/application.

To launch the application, the module must be loaded by require, and the returned function be used as a constructor, passing the following parameters.

1. An element in which to house the app
2. A path to the application's css directory
3. A path to the application's image directory
4. A callback function that will be executed after the module's ready() function is called

## Loading and instantiating

In the example index, the code below was added to load and instatiate the application:

{% highlight javascript %}
require(
    [
        'sampleapp/appui/sampleapp'
    ],
    function(SampleApp) {

        require.ready(function() {

            function onReady() {
                var staticLoadingScreen = document.getElementById('static-loading-screen');
                staticLoadingScreen.parentNode.removeChild(staticLoadingScreen);
            };

            new SampleApp(
                document.getElementById('app'),
                'static/style/',
                'static/img/',
                onReady
            );
        });
    }
);
{% endhighlight %}

The call to require does the following
1. Loads 'static/script/appui/sampleapp.js', the returned function is passed as SampleApp
2. Waits for the DOM to finish loading (`require.ready()`)
3. Invokes SampleApp as a constructor function, passing the required parameters. This launches the application.

In this case the callback (`onReady()`) is simply used to remove the loading screen.

## sampleapp.js

{% highlight javascript %}
require.def('sampleapp/appui/sampleapp',
    [
        'antie/application',
        'antie/widgets/container'
    ],
    function(Application, Container) {

        return Application.extend({
            init: function init (appDiv, styleDir, imgDir, callback) {
                var self = this;

                init.base.call(self, appDiv, styleDir, imgDir, callback);

                // Sets the root widget of the application to be
                // an empty container
                self._setRootContainer = function() {
                    var container = new Container();
                    container.outputElement = appDiv;
                    self.setRootWidget(container);
                };
            },

            run: function() {
                // Called from run() as we need the framework to be ready beforehand.
                this._setRootContainer();
                // Create maincontainer and add simple component to it
                this.addComponentContainer("maincontainer", "sampleapp/appui/components/simple");
            }
        });     
    }
);
{% endhighlight %}

## Responsibilities

Any module extending Application should

* Pass some values through to the constructor of its superclass (anite/Application) to initialise the framework
* Set the root widget of the application

In addition it may
* Add one or more component containers to the application for housing UI elements.
* Add the initial component(s) of the application into the containers.

Once the UI is ready to accept user input, you should call this module's `ready()` method, inherited from Application.

In this example we set the root widget, define a single component container and push a simple component into it.
The newly created component will take the responsibility for calling the `ready()` method when it has been rendered.

## Running the application

The `run()` function is called once by the framework, after the framework has finished initialising.

The `_setRootContainer()` method defined in the constructor is called from `run()` to set the root widget of the application.

`_setRootContainer()` creates an instance of antie/widget/container, sets it to output to the application div passed into the constructor, then sets the container as the root of the application.

The `addComponentContainer()` method:
1. Creates a component container within the application div
2. Adds a component to it

The first argument will be set as the id of the container, the second is the require definition name of the component.

Next [A first component][]

Previous [Creating an index][]
