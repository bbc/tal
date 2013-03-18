---
layout: default
title: Bootstrapping ANTIE
---

ANTIE is primarily a JavaScript framework. However, there are device specific choices that need to be made at the page construction stage, before any JavaScript is executed.

This guide documents one way to create an index page based upon these choices. It is the initial point a device will reach when a user launches your application. 

It is important to understand there are some things ANTIE does not do that are necessary for a functioning application:

* Device detection - Determining what sort of device has just reached your application. This is outside the scope of the project.
* Page construction - We provide methods to work out how to build an index, but don't actually build it for you. This is to allow for flexibility.

### What must index do?

The index should be placed in the root of your application and acts as an entry point.
It needs to be delivered as a page formatted appropriately for the device, and should accomplish the following:

* Load a configuration file for the type of device using the application
* Define an 'Application ID' string and substitute this into the configuration wherever the token %application% appears
* Provide the substituted configuration as a nested object within a javascript global variable 'antie'
* Load any device specific api code / plugin objects
* Configure require.js to alias the application id to the application's javascript directory, and alias `antie` to antie's static directory
* Load require.js
* Load the application javascript entry point.

Optionally, it can create and remove a loading screen while it waits for the framework and application to initialise.

### How can the index vary?

The following may vary between families of device.

* Document Mime Type 
* The DocType tag (e.g. `<!DOCTYPE html>` )
* The root html tag (e.g. `<html>` )
* Additional requirements in the html head block (to load device specific javaScript APIs via `<script>` tags for example)
* Additional requirements in the html body block (to load device specific video plugins for example)

ANTIE encapsulates these variations using 'Page Strategies'. By default they are located in antie/config/pagestrategy.

A class `AntieFramework` is provided in `php/antieframework.php`. This contains methods to interrogate the page strategy for a device and return the appropriate variant of each of the above properties.

Next [Creating an example index.php](indexphp.md)

