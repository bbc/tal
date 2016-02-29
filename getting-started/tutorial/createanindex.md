---
layout: default
title: Creating an index
---


# Creating an index

<p class="lead">Creating an entry point for your TAL Application</p>

The framework is primarily client-side JavaScript. However, there are device specific
choices that need to be made at the page construction stage, before any
client-side JavaScript is executed.

The example below demonstrates one way to create an index page based upon
these choices. It is the initial point a device will reach when a user
launches your application. 

It is important to understand there are some things the framework does not do
that are necessary for a functioning application:

* Device detection - Determining what sort of device has just reached your application. This is outside the scope of the project.
* Page construction - We provide methods to work out how to build an index, but don't actually build it for you. This is to allow for flexibility.

### What must the index do?

The index should be placed in the root of your application and acts as an entry point.
It needs to be delivered as a page formatted appropriately for the device, and should accomplish the following:

* Load a configuration file for the type of device using the application
* Define an 'Application ID' string and substitute this into the configuration wherever the token `%application%` appears
* Provide the substituted configuration as a nested object within a javascript global variable 'antie'
* Load any device specific api code / plugin objects
* Configure require.js to alias the application id to the application's javascript directory, and alias `antie` to antie's static directory
* Load require.js
* Load the application's initial CSS
* Load and launch the application

Optionally, it can create and remove a loading screen while it waits for the application to initialise.

### How can the index vary?

The following may vary between families of device.

* Document Mime Type 
* The DocType tag (e.g. `<!DOCTYPE html>` )
* The root html tag (e.g. `<html>` )
* Additional requirements in the html head block (to load device specific javaScript APIs via `<script>` tags for example)
* Additional requirements in the html body block (to load device specific video plugins for example)

'Page Strategies' encapsulate these variations. These are loaded from a separate repository, [tal-page-strategies](https://github.com/fmtvp/tal-page-strategies). TAL's `package.json` includes the tal-page-strategies repository as a dependency, so the latest set will always be fetched by [NPM](https://www.npmjs.com/) if you are using Node.js.

The TAL repository exposes a module known as AntieFramework as its Node.js entry point. AntieFramework contains methods to return the appropriate variant of each of the above properties. Each method takes a device configuration as a parameter, uses this to determine the page strategy, then uses the page strategy to determine the correct response.

The code for AntieFramework can be found under `node/antieframework.js`. Using TAL in your Node.js application is a matter of defining it as a dependency in package.json:

{% highlight json %}
  "dependencies": {
    "tal": "fmtvp/tal"
  }
{% endhighlight %}

Then use AntieFramework from your own app using Node.js's require mechanism:

{% highlight javascript %}
var AntieFramework = require('tal'),
    antie = new AntieFramework(configPath);
    ...
{% endhighlight %}

If you do not wish to use Node.js in your application, it should be straightforward to replace the methods of AntieFramework with some other server side technology - remembering also to import the page strategies from their repository.

## An example index (NodeJS)

The TAL Example repository [contains an example](https://github.com/fmtvp/talexample/blob/master/index.js) of how to use `AntieFramework` to build a simple index using nodejs.
The supplied code has been written for clarity, not elegance, but should be simple to adapt.

To create a new object you have to indicate the `configPath`. An example constructor using this variable might be:

{% highlight javascript %}
var configPath = "node_modules/tal/config";
var AntieFramework = require('tal');

var antie = new AntieFramework(configPath);
{% endhighlight %}

The [example](https://github.com/fmtvp/talexample) uses some methods of AntieFramework. Most of them take a decoded device configuration file as a parameter.

| Method                       | Description |
| ---------------------------- | ----------- |
| `antie.getMimeType(deviceConfig);`       | Some devices need pages to be delivered with a specific mime type. `getMimeType()` returns an appropriate type for the device |
| `antie.getDocType(deviceConfig); `        | Returns a device appropriate doctype tag, such as `<!DOCTYPE html>` |
| `antie.getRootHtmlTag(deviceConfig);`    | Returns a device appropriate opening page tag, such as `<html>` |
| `antie.getDeviceHeaders(deviceConfig);`  | Returns any device specific content to go in the `<head>` block, such as device api `<script>` tags |
| `antie.getDeviceBody(deviceConfig);`     | Returns any device specific content to go in the `<body>` block, such as device plugin objects |
| `antie.normaliseKeyNames(normString);`     | Normalizes key names e.g. converts `$` and `)` into `_`, and converts the name to lower case |
| `antie.getConfigurationFromFilesystem(key, type);`     | Gets a configuration from the file system. Takes a unique device identifier and the `this._configPath` sub-directory where the device configuration is located |
| `antie.getPageStrategyElement(pageStrategy,`<br>`element, defaultValue);`     | Get a page strategy element, or return the default value if the page strategy does not contain the requested element |
| `antie.mergeConfigurations(originalConfiguration,`<br>` patchConfiguration);`     | Merges the original configuration with the device configuration override properties |

As noted, device detection is out of ANTIE's scope, so we pass in the name of the device configuration as a url parameter.

An example project that uses this framework can be found [here](https://github.com/fmtvp/talexample).


<ul class="pager">
  <li><a href="installation.html">Previous</a></li>
  <li><a href="applicationclass.html">Next</a></li>
</ul>
