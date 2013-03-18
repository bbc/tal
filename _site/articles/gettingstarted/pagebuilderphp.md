[Next Page]: applicationjsentry.md
[Previous Page]: indexphp.md
---
layout: default
title: Constructing the index with PageBuilder and AntieFramework
---

In this section we construct the actual page which will be delivered to the device.

#### Overview

    <?php
    
    class PageBuilder
    {
    
        private $device_configuration;
        private $antie;
        private $application_id;
    
        public function __construct($device_config, $antie, $application_id)
        {
            $this->device_configuration = $device_config;
            $this->antie = $antie;
            $this->application_id = $application_id;
        }
        
The constructor takes the decoded configuration, a reference to an instance of AntieFramework and the application id
        
        public function generate()
        {
            $page = "";
            $page .= $this->generateHeader();
            $page .= $this->generateBody();
            return $page;
        }

generate() creates the page with header and body blocks, returning the page as a string.

        public function getMimeType()
        {
            return $this->antie->getMimeType($this->device_configuration);
        }

getMimeType() passes straight through to the antieFramework function of the same name and returns the appropriate mimetype

        private function generateHeader(){
            $page = "";
            
    
generateHeader() sets up the doctype and root document tags, then generates the `<head>` block of the page.

            $page .= $this->antie->getDocType($this->device_configuration);
            $page .= $this->antie->getRootHtmlTag($this->device_configuration);
            $page .= "<head>";
            
First it adds the doctype and root level `<html>` tag

            $page .= $this->antie->getDeviceHeaders($this->device_configuration);
            
Then loads in any device specific tags, for instance a device api `<script>`

            $page .= $this->generateRequireSetup();
            
Next it adds javascript to configure and load require.js,

            $page .= $this->generateApplicationStyleLink();
            
loads in the application's base style sheet,

            $page .= $this->generateAntieReference();
            $page .= "</head>";
            return $page;
        }

makes the device config available to the framework and closes the head block.

        private function generateBody() {
            $page = "";
            $page .= "<body>";
            
generateBody creates the `<body>` block of the document

            $page .= $this->generateLoadingMessage();

First it displays something on the screen while we load (optional)

            $page .= $this->generateAppDiv();

then creates a div to house the application.

            $page .= $this->generateAppLoadRequireCall();
            $page .= "</body>";
            $page .= "</html>";
            return $page;
        }

Finally we ask require to load the application's JavaScript entry point.

#### Detail

        private function generateRequireSetup()
        {
            return '<script type ="text/javascript" >' .
                   'var require = {' .
                       'baseUrl: "",' .
                       'paths: {' .
                           "$this->application_id: 'static/script'," .

generateRequireSetup configures and loads require.js.
First it takes the application ID defined in index.php and tells require to alias it to the folder static/script when evaluating require definitions. 
This allows you to refer to modules as myapp/mymodule rather then static/script/mymodule without needing to keep js files in your application root.
You should change 'static/script' to a different directory if you put your application JavaScript elsewhere.

                           'antie: "antie/static/script"' .
                           
This aliases 'antie' to antie/static/script. You shouldn't change this unless you plan to restructure antie itself.
                           
                           '},' .
                       'priority: [' .
                       '],' .
                       'callback: function()' .
                       '{}' .
                   '};' .
                   '</script >' .
                   '<script type="text/javascript" src="antie/static/script/lib/require.js"></script>';
        }

Finally require.js itself is loaded
        
        private function generateAntieReference()
        {
            return "<script>" .
                "var antie = {" .
                    "framework: {" .
                        "deviceConfiguration: " . json_encode($this->device_configuration) .
                    "}" .
                "}" .
            "</script>";
        }
        
generateAntieReference makes the loaded device configuration available to the javascript side of the framework.
It stores it within a global object antie, at antie.framework.deviceConfiguration. This location is required by antie and should not be changed.

        private function generateApplicationStyleLink()
        {
            return '<link rel="stylesheet" href="static/style/layout.css" />' ;
        }
        
generateApplicationStyleLink loads in the base style sheet for the application. The framework can dynamically load css, but you can guarantee anything in here will be loaded first. 
We've chosen to put it in static/style/layout.css, but feel free to move/rename it to whatever you like.

        private function generateLoadingMessage() {
            return '<div id="static-loading-screen" style="position: absolute; width: 100%; height: 100%;">' .
                'Application is loading' .
                '</div>';
        }

Loading a complex app can take a little while, generateLoadingMessage just puts up a message to reassure your users

        private function generateAppDiv() {
            return '<div id="app" class="display-none"></div>';
        }
        
The application will lives within a div, created here. We'll pass it to our application's javascript entry point later.

        private function generateAppLoadRequireCall() {
            return "<script type='text/javascript'>" .
                "require(" .
                        "[" .
                            "'" . $this->application_id . "/appui/" . $this->application_id . "'" .
                        "]," .
                        
generateAppLoadRequireCall is used to load the javascript entry point of the application via require.js
In this case we've given it the same name as the application ID, and it resides in static/script/appui/application\_id.
As we've aliased application\_id to static/script we can load it via application\_id/appui/application\_id

                        "function(AntieApp) {" .
                            "require.ready(function() {" .
                                "function onReady() {" .
    
                                    "var staticLoadingScreen = document.getElementById('static-loading-screen');" .
                                    "staticLoadingScreen.parentNode.removeChild(staticLoadingScreen);" .
                                "};" .
                                
The entry point needs to call `application.ready()` (a framework method) when it is ready to accept user input.
When that call is made, the `onReady` function, provided as a callback below, will be executed. It removes the loading screen.
    
                                "new AntieApp(" .
                                        "document.getElementById('app')," .
                                        "'static/style/'," .
                                        "'static/img/'," .
                                        "onReady\n" .
                                ");" .
                                
The new AntieApp call instatiates our application via the entry point. AniteApp is just the name we've given the value returned by the require call, you can change this to something else if you like. The application div created earlier is passed as an argument along with paths for loading CSS and Images.
                                
                            "});" .
                        "}" .
                ");" .
           " </script>";
        }
    }

[Next Page][] Beginning your application in JavaScript

[Previous Page][] 
