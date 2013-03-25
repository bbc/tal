---
layout: default
title: Creating an index
---


# Creating an index

<p class="lead">Creating an entry point for your TAL Application.</p>

The framework is primarily JavaScript. However, there are device specific
choices that need to be made at the page construction stage, before any
JavaScript is executed.

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

'Page Strategies' encapsulate these variations. By default they are located in antie/config/pagestrategy.

A class `AntieFramework` is provided in `php/antieframework.php`. It contains methods to return the appropriate variant of each of the above properties. Each method takes a device configuration as a parameter, uses this to determine the page strategy, then uses the page strategy to determine the correct response.

If you do not wish to use php in your application, it should be straightforward to replace the methods of AntieFramework with some other server side technology.

## An example index

Below is an example of how to use `AntieFramework` to build a simple index.
The supplied code has been written for clarity, not elegance, but should be simple to adapt.

The example uses some methods of AntieFramework. They all take a decoded device configuration file as a parameter.

| Method                       | Description |
| ---------------------------- | ----------- |
| `getMimeType($config)`       | Some devices need pages to be delivered with a specific mime type. `getMimeType()` returns an appropriate type for the device |
| `getDocType($config)`        | Returns a device appropriate doctype tag, such as `<!DOCTYPE html>` |
| `getRootHtmlTag($config)`    | Returns a device appropriate opening page tag, such as `<html>` |
| `getDeviceHeaders($config)`  | Returns any device specific content to go in the `<head>` block, such as device api `<script>` tags |
| `getDeviceBody($config)`     | Returns any device specific content to go in the `<body>` block, such as device plugin objects |

As noted, device detection is out of ANTIE's scope, so we pass in the name of the device configuration as a url parameter.

`index.php`

{% highlight html+php %}
<?php

// INIT AND CONFIG LOAD

// Check TAL is available
if (!file_exists('antie/php/antieframework.php')) {
    echo "<h2>Framework error</h2>";
    echo "<h4>antieframework.php can not be found.</h4>";
    echo "<h4>Please install TAL to a folder 'antie' in your application's root</h4>";
    exit;
}

require('antie/php/antieframework.php');

// Set up application ID and path to framework configuration directory
$application_id = "sampleapp";
$antie_config_path = 'antie/config';

// Create an AntieFramework instance
$antie = new AntieFramework($antie_config_path);

// Get brand and model from url parameters, or use 
// brand = default, model = webkit
$device_brand = isset($_GET['brand'])? $_GET['brand'] : 'default';
$device_model = isset($_GET['model'])? $_GET['model'] : 'webkit';

// Normalises to lower case with spaces replaced by underscores
$device_brand = $antie->normaliseKeyNames($device_brand);
$device_model = $antie->normaliseKeyNames($device_model);

// Framework device config files in format BRAND-MODEL-default.json 
// Construct filename from this and config path
$device_configuration_name = $device_brand . "-" . $device_model;
$device_configuration_file_path = $antie_config_path . "/devices/" . $device_configuration_name . "-default.json";

// Load in device configuration
try {
    $device_configuration = @file_get_contents($device_configuration_file_path);
    if(!$device_configuration)
        throw new Exception("Device ($device_configuration_name) not supported");
} catch(Exception $e){
    echo $e->getMessage(); exit;
}

// Substitute appid wherever /%applicaion%/ is present in device configuration
$device_configuration = preg_replace('/%application%/m', $application_id, $device_configuration);

// Decode to php object
$device_configuration_decoded = json_decode($device_configuration);



// PAGE GENERATION

// Set document mime type
header("Content-Type: " . $antie->getMimeType($device_configuration_decoded));

// Set doctype and opening html tag
echo $antie->getDocType($device_configuration_decoded);
echo $antie->getRootHtmlTag($device_configuration_decoded);
?>



<!-- HEAD -->

<head>
    <!-- Device specific head block (API loading etc) -->
<?php
    echo $antie->getDeviceHeaders($device_configuration_decoded);
    ?>

    <!-- Set up require aliases -->
    <script type="text/javascript">
        var require = {
            baseUrl: "",
            paths: {
                <?php echo $application_id; ?>: 'static/script',
                antie : "antie/static/script"
            },
            priority: [],
            callback: function() {}
        };
    </script>

    <!-- Load require.js -->
    <script type="text/javascript" src="antie/static/script/lib/require.js"></script>

    <!-- Load application base style sheet -->
    <link rel="stylesheet" href="static/style/base.css"/>

    <!-- Expose device config to framework -->
    <script>
        var antie = {
            framework: {
                deviceConfiguration: <?php echo $device_configuration ?>
            }
        }
    </script>

</head>



<!-- BODY -->

<body style="background: #000;">

<!-- Add in device specific body (Plugins etc) -->
<?php echo $antie->getDeviceBody($device_configuration_decoded); ?>

<!-- Create a loading message -->
<div id="static-loading-screen" style="position: absolute; width: 100%; height: 100%; background: #000;">
    Application is loading...
</div>

<!-- Create a div to house the app -->
<div id="app" class="display-none"></div>

<!-- Load the application and launch, remove loading screen via callback -->
<script type='text/javascript'>
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
</script>

</body>
</html>
{% endhighlight %}

<ul class="pager">
  <li><a href="installation.html">Previous</a></li>
  <li><a href="applicationclass.html">Next</a></li>
</ul>
