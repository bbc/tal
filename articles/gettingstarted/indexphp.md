---
layout: default
title: Creating an example index.php
---

This section and the next form an example of how to use `AntieFramework` to build a simple index.
The supplied code has been written for clarity, not elegance, but should be simple to adapt.

### Example index.php

In this section we will load in a device configuration and initialise `AntieFramework`
As noted, device detection is out of ANTIE's scope, so we pass in the name of the configuration as a url parameter.

The actual construction of the page is deferred to a class, PageBuilder, which is detailed in the next section.
PageBuilder is specific to this example rather then a part of ANTIE.

`index.php`

    <?php
    include('antie/php/antieframework.php');
    include_once('php/pagebuilder.php');

Include AntieFramework and PageBuilder (detailed below)

    $application_id = "sampleapp";

Name your application

    $antie_config_path = 'antie/config';
    
Define configuration path for antie - this is the default

    $antie = new AntieFramework($antie_config_path);
    
Instantiate AntieFramework with config path

    $device_configuration_key = isset($_GET['config']) ? $_GET['config'] : 'html5';
    
For this example, the device config name is passed in as a URL parameter ?config=config_name
Default to 'html5' if no name is passed.

    $device_configuration_file_path = "config/$device_configuration_key.json";
    
The device configuration files will live in a folder named 'config'

    try {
        $device_configuration = @file_get_contents($device_configuration_file_path);
        if (!$device_configuration)
            throw new Exception("Device ($device_configuration_key) not supported");
    } catch (Exception $e) {
        echo $e->getMessage();
        exit;
    }

Load the contents of the specified device configuration file

    $device_configuration = preg_replace('/%application%/m', $application_id, $device_configuration);
    
There are some %application% tokens in the configurations that need to be replaced with the application id

    $device_configuration = json_decode($device_configuration);
    
Decode from a json string into a php object.

    $pageBuilder = new PageBuilder($device_configuration, $antie, $application_id);

Create a PageBuilder instance using the decoded device config, instance of AntieFramework and application name.
This will be used to construct the index. 

    header("Content-Type: " . $pageBuilder->getMimeType());
    
Set the mime type of the index page to that required by the device

    echo $pageBuilder->generate();
    
Generate the page

Next [Constructing the index with PageBuilder and AntieFramework](pagebuilderphp.md)
