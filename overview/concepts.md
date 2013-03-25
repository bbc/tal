---
layout: default
title: Concepts
---

# Concepts

<p class="lead">A brief overview of some concepts and terminology used throughout the TV
Application Framework and this documentation.</p>

## Require.js

The framework is organised as a set of [Require](http://requirejs.org/) modules. A modified
version of *require.js 0.15* is supplied. We have experienced issues with later versions on
some devices. We explicitly declare all module names. Problems have been encountered on some
devices with anonymous module loading.

## Inheritance
To provide an easy route into JavaScript application development, TAL makes use of a
classical inheritance model based on John Resig's
[Class](http://ejohn.org/blog/simple-javascript-inheritance/). All classes extend
`antie/Class`. This provides `extend()` which you can use to create a sub-class.

You are welcome to use prototypal inheritance, classical inheritance or a mixture of both
within your application, as long as you do not modify the prototypes of any
framework-provided class, and ensure you call any overridden methods of the base class.
Failure to do either of these may cause unexpected behaviour in the framework.

## Naming Conventions
A few naming conventions are used throughout the framework:

* Classes are in camel case with an initial capital letter, e.g. HelloWorldApplication.
* Variables are in camel case with a lower-case initial character.
* Widget IDs are in camel case with a lower-case initial character.
* HTML/CSS class names are in camel case with a lower-case initial character.
* Private or protected properties are indicated by a leading underscore, e.g. this._privateProperty.
* `var self = this;` is used throughout for preserving `this` context in closures.

## Module format
The above conventions result in code like:

{% highlight javascript %}
require.def('sampleapp/some/path/to/a/module',
    [
        'antie/a/framework/dependency',
        'sampleapp/a/dependency/from/the/application/codebase'
    ],
    function(Dependency, CodeBase) {
    
        var privateStaticStuff;
        
        var Module = CodeBase.extend({
                init: function(some, arguments) {
                    // constructor
                    this._privateProperty = new Dependency(
                        'arguments', 
                        'passed', 
                        'to', 
                        'init()', 
                        'of', 
                        'Dependency');
                },
                method: function() {
                    // public instance method
                },
                _notForYou: function() {
                    // private instance method
                }
            });
        
        Module.PUBLIC_STATIC_PROPERTY = "somethingOrOther";
        
        return Module;
    }
);
{% endhighlight %} 

## UI Concepts

### Base application class
Applications **must** extend the Application base class. This provides a `run()` method that is executed when the Framework has fully initialised. 
You must at some point in the application startup call the `Application.ready()` method to instruct the framework that your application has started up. 

### Widgets
On-screen UI controls are called *Widgets*.
The GUI is built from a tree structure of instances of *Widgets*. 

#### Buttons
A *Button* or subclass of *Button* is a Widget that can obtain input focus (and thus be spatially navigated between).
All Widgets have the notion of active state (i.e. when focus is moved to that widget, the Active child will receive focus).

#### Containers
*Container* widgets are widgets that may contain child widgets.

### Components
*Components* are modules that may be defined to provide a re-usable section of UI in a memory efficient manner.
*Components* must be loaded into a *ComponentContainer*. For more information see [Component system](components.html)
