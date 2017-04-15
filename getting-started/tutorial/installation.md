---
layout: default
title: Installation and Configuration
---
[Creating an index]: createanindex.html

# Installation

<p class="lead">Getting started with the TV Application Layer</p>

Create a new directory to house your application and configure your web server to serve files from it.
If you are going to make use of the (minimal) Node.js bootstrap code included within the framework, you will also need [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/) installed.

If you intend to use IIS, you can install PHP from <http://php.iis.net/>, or via the Web Platform Installer. You must also enable the CGI feature in IIS (Control Pannel-->Turn Windows features on or off-->Internet Information Services-->World Wide Web Services-->Application Development Features-->CGI).

Within the application directory, check out the TAL repo to a folder named 'antie' (the internal name for TAL)

    git clone https://github.com/fmtvp/tal.git antie

Change into the directory and use NPM to install its node.js dependencies:

    cd antie
    npm install

You can arrange the rest of your application as you please, but the example applications and included device configurations assume the directory structure below:

## Sample Application Structure

    ├── sampleapp                                   // Root application folder
    │   ├── antie                                   // The framework
    |   |   ├── config                              // Framework configuration directory
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

## Device Configuration Files

The framework abstracts device specific portions of code to a common API. To specify which differences apply to which devices, configuration files are used \[1\]. The framework contains configuration files for a number of devices which specify defaults we have found to work well. You are free to override these defaults and provide your own configuration via device configuration files within your application. \[2\]

For more information see [Device Configuration]({{site.baseurl}}/overview/device-configuration.html).

## Example Applications

The talexample repository contains an example framework application. It demonstrates the use of some TAL widgets and media playback.

It includes its own simple web server implemented in Node.js. While TAL's static JavaScript files can be hosted statically on any web server, the [index page](createanindex.html) - containing the &lt;script&gt; tags that power TAL - must be generated based on the calling device's brand and model. The Node.js server included with the example project performs both roles for simplicity.

To check out and run the example project:

    git clone https://github.com/fmtvp/talexample.git talexample
    cd talexample
    npm install
    node index.js

Finally, browse to:

    http://127.0.0.1:1337/

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

## Hello World

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
