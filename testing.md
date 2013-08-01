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
    

Some of the more useful command line options provided by JsTestDriver can be set via rake. Use rake help to see what is supported. Commonly you will want to run a subset of the tests. This can be achieved by specifying `tests=/your reg ex/` on the command line. eg. `rake tests="Network"`. The regular expression is being matched against the label given to the test cases in the JavaScript test file. eg. `this.DefaultNetworkTest = AsyncTestCase("Network (Default)")`;

Specifying `verbose=1` on the command line will provide a more verbose output - useful for when tests are failing.

Another useful feature is the browser automation and ability to use a Selenium Grid. Use `webdriverurl=chrome`, on the command line, to have the test launch a Chrome instance, run the tests and exit. The webdriverurl argument can also be a url to a Selenium Grid instance.

###Testing On Devices

These test can also be run on directly on devices. This requires being able to navigate the device's browser to the JsTestDriver capture page, as the selenium browser automation can not be used. Not all test are compatible with all devices. To avoid any false negative fails the test harness can be made to reject tests which are not compatible with the device. To do this the rake file has two options to provide a suitable device config to be used during the tests: `path_to_device_config=<path/to/device/config>` and `url_to_device_config=<url/to/device/config>`


With `path_to_device_config=<path/to/device/config>` this should be a path to one of the existing device config files; for example `../config/devices/chrome-20_0-default.json`, with `url_to_device_config=<url/to/device/config>` this should be a url which supplies the correct config for the device to be tested. The device config should be returned in a particular format, like this...


    (function() {
      window.deviceConfig = {
        "pageStrategy": "html5",
        "modules": {
          "base": "antie/devices/browserdevice",
          "modifiers": \["antie/devices/anim/styletopleft", "antie/devices/media/html5",
          ...
      }

see `ondevicetesting-deviceconfig.php` in the php directory for a working example that can provide the config in the required format.
To make a set of tests 'device aware' some extra code should be added to the tests. For example, the History strategy tests use a specific modifer. The following line of code:

```onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/history'], this.HistoryExitTest);```

asserts that the `antie/device/exit/history` modifier is present in the current device config and if not the test will NOT be executed.
The full unit test can be seen below.


    (function() {
      this.HistoryExitTest = AsyncTestCase("Exit_History");
      this.HistoryExitTest.prototype.testExit = function(queue) {
        expectAsserts(1);
        var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/exit/history"]},"input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};        queuedApplicationInit(queue, "lib/mockapplication", [], function(application) {
          var expected = 0 - (history.length -1);
            sinon.stub(history, 'go', function(length) {
                history.go.restore();
              }
              assertEquals("History.go(length) is " + length, expected, length);
            });
            application.getDevice().exit();
          }, config );
        };
	  onDeviceTestConfigValidation.removeTestsForIncompatibleDevices(['antie/devices/exit/history'], this.HistoryExitTest);
    })();

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
