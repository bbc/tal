---
layout: default
title: Installation and Configuration
---
[Creating an index]: createanindex.html
#Installation

<p class="lead">Getting started with the TV Application Layer</p>

Create a new directory to house your application and configure your web server to serve files from it.
If you are going to make use of the (minimal) php included within the framework, you will also need [php5](http://php.net/downloads.php) installed and configured.

Within the application directory, check out the TAL repo to a folder named 'antie' (the internal name for TAL)

    git clone https://github.com/fmtvp/tal.git antie

You can arrange the rest of your application as you please, but the example applications and included device configurations assume the directory structure below:

##Sample Application Structure
    ├── sampleapp                                   // Root application folder
    │   ├── antie                                   // The framework
    |   |   ├── config                              // Framework configuration directory
    |   |   |   ├── pagestrategy                    // Page strategy directories
    |   |   |   ├── devices                         // Framework Device configuration files [1]
    |   |   |       ├── sometv.json              
    |   |   |       ├── someothertv.json
    |   |   |       ├── myfaveblurayplayer.json
    |   |   |       ├── ...
    |   |   ├── ...                                 // Other framework directories                             
    │   ├── config                                  // Application device configuration files [2]
    │   │   ├── sometv.json
    │   │   ├── someothertv.json
    │   │   ├── myfaveblurayplayer.json
    |   |   ├── ...
    │   ├── index.php                               // Index - application entry point for devices
    │   ├── static                                  // JavaScript, images, video etc
    │   │   ├── script                              // JavaScript
    │   │   │   ├── appui
    │   │   │   │   ├── components                  // The components that make up the application
    │   │   │   │   │   ├── videoplayer.js
    │   │   │   │   │   ├── menubrowser.js
    │   │   │   │   ├── layouts                     // Resolution specific configuration
    │   │   │   │   │   ├── 1080p.js
    │   │   │   │   │   ├── 540p.js
    │   │   │   │   │   └── 720p.js
    │   │   │   │   └── sampleapp.js                // JavaScript entry point of the application
    │   │   │   └── image                           // Local images
    │   │   │       ├── prettypic.jpeg
    │   │   │       ├── toptvshow.jpeg
    │   │   │       ├── titlebar.jpeg
    │   │   │       └── penguins.jpeg
    │   │   └── style                               // CSS
    │   │       ├── base.css                        // Base - Applied to everything
    │   │       └── layouts                         // Resolution specific styles
    │   │           ├── 1080p.css
    │   │           ├── 540p.css
    │   │           └── 720p.css

If you do use another structure, you will need to:

* Update the paths when initialising your application 
* Override the default layout paths provided in the framework device configuration files from your application device configuration files.

##Device Configuration Files

The framework abstracts device specific portions of code to a common API. To specify which differences apply to which devices, configuration files are used \[1\]. The framework contains configuration files for a number of devices which specify defaults we have found to work well. You are free to override these defaults and provide your own configuration via device configuration files within your application. \[2\]

For more information see [Device Configuration]({{site.baseurl}}/overview/device-configuration.html).

##Example Applications

The talexample repository contains an example framework application. It demonstrates the use of some TAL widgets and media playback.

Change to the root directory of a web server set up to serve html, javascript and php5. Then, to check out the example:

    git clone https://github.com/fmtvp/talexample.git talexample
    cd talexample
    git clone https://github.com/fmtvp/tal.git antie

Finally, browse to:

    http://yourserver.com/talexample

<ul class="thumbnails">
  <li class="span6">
    <div class="thumbnail">
      <a href="{{site.baseurl}}/img/getting-started/tutorial/example1.png">
        <img src="{{site.baseurl}}/img/getting-started/tutorial/example1s.jpg" alt="">
      </a>
      <p class="lead">Example Application Menu</p>
    </div>
  </li>
  <li class="span6">
    <div class="thumbnail">
      <a href="{{site.baseurl}}/img/getting-started/tutorial/example2.png">
        <img src="{{site.baseurl}}/img/getting-started/tutorial/example2s.jpg" alt="">
      </a>
      <p class="lead">Example Application Carousel</p>
    </div>
  </li>
</ul>

##Hello World

Over the next few pages we will describe the minimum setup required to launch a TAL application for use on multiple devices.

This stripped down 'Hello World' application is also in the talexample repo, but on a separate branch, helloworld

    git checkout helloworld
    
<ul class="thumbnails">
  <li class="span6 offset3">
    <div class="thumbnail">
      <a href="{{site.baseurl}}/img/getting-started/tutorial/helloworld.png">
        <img src="{{site.baseurl}}/img/getting-started/tutorial/helloworlds.png" alt="">
      </a>
      <p class="lead">Hello World</p>
    </div>
  </li>
</ul>
Next page: [Creating an index][]