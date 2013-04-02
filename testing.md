---
layout: default
title: Testing
---

#Testing

## Unit Tests
TAL comes complete with an extensive set of unit tests.

The tests themselves are located in 

    antie/static/script-tests/tests/
    
The tests mimic the file structure of antie, with one test file per antie file.

We us *[sinon.js][]* to help write tests and *[JsTestDriver][]* to run them.

### Running the tests
To use our test runner script you will need a working installation of *[Ruby][]*.

You can generate the required configuration files and execute a test run via rake.

    cd antie/static/
    
If you do not have bundler installed

    gem install bundler

Then

    bundle
    rake

This will generate the required configuration and launch a JsTestDriver server on [http://localhost:9876](http://localhost:9876)

To capture a browser and start the tests, navigate to

    http://localhost:9876/capture/

To see a list of options

    rake help

### Writing tests

All TAL tests are defined within JsTestDriver _AsyncTestCase_ instances. Most use [sinon.js][].

In addition to reading the [sinon.js][] and [JsTestDriver][] documentation, there are a few TAL specific points to note:

#### queuedRequire, queuedApplicationInit and queuedComponentInit

These are helper methods for loading in framework modules under test and ensure they are unloaded in teardown.
The methods should be used as follows:

* Use `queuedRequire()` if the module under test is isolated and does not require an initialised application context (directly or indirectly)
* Use `queuedApplicationInit()` if the module under test needs an application context but is not a component
* Use `queuedComponentInit()` when testing a component

{% highlight javascript %}
this.ExampleTest = AsyncTestCase("Example");

this.ExampleTest.prototype.testExample = function(queue) {
    queuedRequire(queue, 
        [
            "antie/widgets/widget"
        ], 
        function(Widget) {
            var widget;
            widget = new Widget();
            assert(widget instanceof Class);
        }
    );
};
{% endhighlight %}

#### Sinon sandbox

We create a Sinon sandbox in the test case's `setUp()` method and call `sandbox.restore()` during `tearDown()`. You should access Sinon's methods through the sandbox to ensure any stubs/spies/mocks are removed post test.

{% highlight javascript %}
this.ExampleTest.prototype.setUp = function() {
    this.sandbox = sinon.sandbox.create();
};

this.ExampleTest.prototype.tearDown = function() {
    this.sandbox.restore();
};
{% endhighlight %}

#### Sinon's assertions

If you wish to use Sinon's assertions and have JsTestDriver's `expectAsserts()` method include them in its assertion count, you need to define the `sinon.assert.pass` method:

{% highlight javascript %}
sinon.assert.pass = function() {
   assert(true);
};
{% endhighlight %}


#### Dealing with dependencies

You can stub out methods on a dependencies by loading the dependency via the queued functions, then stubbing the prototype of the dependency before instantiating the dependent class.

As require only loads each module once, the dependent module gets the stubbed method.

{% highlight javascript %}
this.ExampleTest.prototype.stubExample = function(queue) {
    queuedRequire(
        queue, 
        [
            "sampleapp/dependency",
            "sampleapp/somemodule"  // SomeModule also loads Dependency in its require definition
        ], 
        function(Dependency, SomeModule) {
            var someModule;
            this.sandbox.stub(
                Dependency.prototype, 
                'someMethod', 
                function() { "do something else"; }
            ); 
            someModule = new SomeModule();  // If SomeModule creates an instance of Dependency
                                            // that instance will get the stubbed method.
        }
    );
};
{% endhighlight %}

[sinon.js]: http://sinonjs.org/
[JsTestDriver]: https://code.google.com/p/js-test-driver/
[Ruby]: http://www.ruby-lang.org/
