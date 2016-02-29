---
layout: default
title: Testing
---

#Testing

## Client Unit Tests
TAL comes complete with an extensive set of unit tests.

The tests themselves are located in 

    static/script-tests/tests/
    
The tests mimic the file structure of TAL, with one test file per implementation file.

Tests are written in *[JsTestDriver][]* (for older tests) and *[Jasmine][]* (preferred for future development). We use *[sinon.js][]* as a mocking library.

Tests are run in [Jasmine][], with a [custom adaption layer](#jstestdriver-adapter-and-jasmine-13) to run the older JsTestDriver tests under Jasmine.

### Running the tests

Ensure you have `node` and `npm` available on your system by installing [Node.js][].

Then ensure that grunt-cli is installed:

    npm install grunt-cli -g

Automatically install the required Node packages to the root of your TAL working copy. Change to the root of the working copy, then:

    npm install

You now have the choice of running the tests in the console, or in a browser window.

#### Running tests in the console

Tests can be run in the console, using [PhantomJS][] (installed as part of `npm install`), with the following command:

    grunt test

#### Running tests in a browser window

The following command will generate *SpecRunner.html* and open it in your default browser, running the tests in the Jasmine UI:

    grunt spec

Note that SpecRunner.html will persist after `grunt spec`, whereas it will be deleted after `grunt test`. Because it is a generated file, it should not be committed to the repository.

Running the tests in a browser window is useful for debugging, while running them in the console is useful for CI jobs and for sanity checking.

#### Filtering by test name

You can run a subset of the tests by applying a filename filter to either `grunt spec` or `grunt test`. For example:

    grunt test --filter=carousel

### Writing tests

Most TAL tests are defined within JsTestDriver _AsyncTestCase_ instances. Most use [sinon.js][].

Newer TAL tests, particularly ones that can run synchronously, are written directly in Jasmine. This is the desired future direction of the framework.

In addition to reading the [sinon.js][], [Jasmine][] and [JsTestDriver][] documentation as appropriate, there are a few TAL specific points to note:

#### JsTestDriver Adapter and Jasmine 1.3

The JsTestDriver adaption layer we use to run old JsTestDriver tests under Jasmine is located at:

    static/script-tests/jasmine/jstestdriver-adapter.js

Hopefully you will not need to investigate it, but it's useful to know it's there.

We are currently on Jasmine 1.3 rather than the more recent [Jasmine 2.0](http://jasmine.github.io/2.0/introduction.html). This is because the adaption layer is written against Jasmine 1.3 and utilises some of its internals. We hope to update to Jasmine 2.0 at some point in the future.

#### queuedRequire and queuedApplicationInit

These are helper methods for loading in framework modules under test and ensure they are unloaded in teardown.
The methods should be used as follows:

* Use `queuedRequire()` if the module under test is isolated and does not require an initialised application context (directly or indirectly)
* Use `queuedApplicationInit()` if the module under test needs an application context

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
[Jasmine]: http://jasmine.github.io/1.3/introduction.html
[Node.js]: https://nodejs.org/
[PhantomJS]: http://phantomjs.org/

## Server Unit Tests

### NodeJS Server
For the TAL server side NodeJS code, using nodeunit:

1\. Install nodeunit: https://github.com/caolan/nodeunit

    npm install -g nodeunit


2\. Run the tests:

    cd node-test
    nodeunit .

Expected sample output:

    antieframeworktest
    ✔ Generic TV1 Device has no Headers
    ✔ Generic TV1 Device has no body
    ✔ Generic TV1 Device has default Mime type
    ✔ Generic TV1 Device has default Root element
    ✔ Generic TV1 Device has default Doc type
    ✔ Device has expected header
    ✔ Device has expected body
    ✔ Device has expected Mime type
    ✔ Device has expected Root element
    ✔ Device has expected Doc type
    ✔ Normalise key names replaces special characters with underscores
    ✔ Normalise key names replaces upper case to lower case
    ✔ Get generic device config
    ✔ Get generic app config
    ✔ Get generic app config (Alt)
    ✔ App config overrides device config when merged

    OK: 16 assertions (23ms)
