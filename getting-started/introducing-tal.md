---
layout: default
title: Getting Started | Introducing TAL
---

# Introducing TAL

<p class="lead">The <em>TV Application Layer (TAL)</em> is an open source library for building applications for Connected TV devices.</p>

*TAL* was developed internally within the BBC as a way of vastly simplifying TV application development
whilst increasing the reach of BBC TV applications such as *iPlayer*. Today all of the BBC's HTML-based
TV applications are built using *TAL*.

There are a number of reasons we've decided to share TAL as an open source project:
* Sharing the code allows other parties to contribute. Hopefully making the product better for everyone who uses it
* Sharing TAL should make building applications on TV easier for others, helping to drive the uptake 
of this nascent technology. The BBC has a history of doing this and we are always looking at new 
ways to reach our audience.
* The BBC is always looking at ways in which it can partner with the wider industry. Sharing TAL is a 
great way to allow application developers to reach a large range of Connected TV 
Devices. Equally it helps device manufacturers increase the number of applications for their 
devices.

## The Difficulties in Developing for Connected TV Devices

There are hundreds of different devices in the marketplace and they all use slightly different technologies
to achieve the same result. The purpose of TAL is to allow you to write an application once, and be confident
that it can be deployed to all HTML-based TV devices.

<ul class="thumbnails">
  <li class="span8 offset2">
    <div class="thumbnail">
      <img data-src="{{site.baseurl}}/img/getting-started/bbc-tal.jpg" src="{{site.baseurl}}/img/getting-started/bbc-tal.jpg" alt="">
    </div>
  </li>
</ul>

*iPlayer*, *BBC News*, and *BBC Sport* are three high profile TV applications built on TAL. Click on the images for larger versions:

<ul class="thumbnails">
  <li class="span8 offset2">
    <div class="thumbnail">
      <a href="{{site.baseurl}}/img/getting-started/iPlayer.jpg"><img src="{{site.baseurl}}/img/getting-started/iPlayer_50.jpg" alt=""></a>
      <p class="lead">TAL originated from iPlayer</p>
      <p>TAL was extracted from iPlayer as a standalone library to enable further app development.</p>
    </div>
  </li>
</ul>

<ul class="thumbnails">
  <li class="span6">
    <div class="thumbnail">
      <a href="{{site.baseurl}}/img/getting-started/SportApp.jpg"><img data-src="{{site.baseurl}}/img/getting-started/SportApp.jpg" src="{{site.baseurl}}/img/getting-started/SportApp_50.jpg" alt=""></a>
      <p class="lead">BBC Sport App</p>
      <p>TAL enabled the BBC to build the Sport App in time for the 2012 Olympics.</p>
    </div>
  </li>
  <li class="span6">
    <div class="thumbnail">
      <a href="{{site.baseurl}}/img/getting-started/NewsApp.jpg"><img src="{{site.baseurl}}/img/getting-started/NewsApp_50.jpg" alt=""></a>
      <p class="lead">BBC News</p>
      <p>The BBC News TV app is the latest BBC product to benefit from TAL.</p>
    </div>
  </li>
</ul>

*TAL* is hosted on Github. This is the actual version of *TAL* we use within the BBC, not some limited, cut-down portion of the
library. This is an actively developed project looked after by a team in Salford. We
welcome any contributors. We've adopted the popular [*Fork and Pull Model*](https://help.github.com/articles/using-pull-requests)
-- please fork our repo and send us a pull request when you are ready to contribute back.

Take a look [here](../other/contributing.html) for more details on how to contribute.

## TAL Documentation

All our documentation is hosted by GitHub on these pages. The main sections are as follows:

* **Getting Started** -- Gentle introductions and tutorials to get you up and running
* **Overview** -- Technical articles explaining the core concepts and components
* **Widgets** -- Documentation of our widgets and how to use them to build your application UI
* **Other** -- More advanced topics like local storage, application exiting, open source contribution details
* **JS Doc** -- Javascript reference documentation generated from the code
* **Testing** -- How to test your code
* **FAQ** -- High level, frequently asked questions

We also have a [sample application](https://github.com/fmtvp/talexample) that you can use as a guide to
help you build your own applications.

If you spot anything wrong or missing in the documentation, [contact us](../other/contact.html), or why not send us a pull request
with the corrected content (checkout the [gh-pages](https://github.com/fmtvp/tal/tree/gh-pages) branch).

## Prerequisite Knowledge

You will need to be comfortable with the following technologies:
* JavaScript
* HTML and CSS
* Some PHP might be useful to understand the tutorial

## Writing Applications for TVs

Our experience of writing TV Applications has shown us that while most
Connected TV devices contain a web browser built upon something
fairly familiar like *WebKit* or *Opera*, there are still some pretty big
variations in the way that devices do the following:

* media playback
* animation
* networking
* logging
* JSON parsing
* persistant storage
* remote control key codes

TAL works to abstract these things. The
bulk of your development can be done on a desktop browser that is built
on the same origins as the TV browsers. It does not mean there would not be
things that work differently once you run your application on TV devices,
but it does mean that you can focus on building the features you want in
your app rather than worrying about TVs too much.

Our own experience has been that even when we build our TV applications
on TAL, applications perform differently across devices. Some of the
differences are due to the device specification, others due to the
variances in the browser.

Running your application on a TV can be challenging and differs from manufacturer
to manufacturer. The best way to test your applications on the big screen is to
contact manufacturers directly and arrange to get access via a widget in their TV
App store or through developer menus.
