---
layout: faq
title: FAQ
---
# FAQ
<p class="lead">Common questions relating to the framework.</p>

### **Question:** What does *TAL* stand for?  
**Answer:** TV Application Layer

### **Question:** What technologies does it support?  
**Answer:** TAL is for HTML technology based devices.  It does not support Flash or MHEG. 

### **Question:** Where has it come from?  
**Answer:** TAL was created by the BBC to build TV Applications.

### **Question:** Who can use this?  
**Answer:** TAL is available to everyone under the terms of the Apache V2.0 open source licence.

### **Question:** The terms of the Apache Licence don't meet our requirements.  Are there any other options?  
**Answer:** the BBC has adopted a dual licensing approach and can make available TAL under a separate 
proprietary licence agreement. Please contact us for details of these terms.

### **Question:** Why has the BBC shared TAL via Open Source?
**Answer:** The biggest technical reason for making TAL available as an open source project
is so that it can be picked up and contributed to by others (manufacturers, content providers,
3rd parties), helping to standardise the the way TV Applications are made, and benefitting
everyone.

### **Question:** How do I use GitHub?
**Answer:** There is a [short tutorial](http://try.github.com/levels/1/challenges/1) that
we found quite useful.

### **Question:** Why use the Apache 2.0 licence?  
**Answer:** We looked at the wide range of licences and found that Apache v2.0 best 
met our requirements.
Specifically it encourages others to contribute, whilst not restricting its use in commercial products.
It's also a well recognised licence type.  For more details about the Apache 2.0
licence see the [Open Source Initative](http://opensource.org/licenses/Apache-2.0)

### **Question:** Is this the latest code?
**Answer:** Yes. This is the live repository that the BBC uses to host its code and it build its own 
TV Applications with.  It is not a copy or a mirror.

### **Question:** Will this work on all Connected TV devices?
**Answer:** TAL will work on most HTML-based Connected TV devices and it's structured 
in such a way that it's relatively easy to add support for a device that isn't already supported.

### **Question:** Is there a list of supported devices?
**Answer:** TAL will work on Samsung devices (2010 onwards), Panasonic (2011 onwards), 
Sony (2011 onwards), Toshiba (2011 onwards), LG (2012 onwards) and a whole range of others.  Please see the [config folder](https://github.com/fmtvp/tal/tree/master/config/devices)

### **Question:** Where is the device configuration for the 'ACME 2013' device?   
**Answer:** There are two likely answers to this.  The first is that TAL doesn't work on that device 
(either the BBC has not seen it yet or when we did, there was a problem getting TAL to run on it).  
Secondly, it could be that the manufacturer hasn't granted permission for the file to be hosted here.

### **Question:** Does the TV Application Layer work on Sony TV, Blu-ray players and PS3?
**Answer:** TAL is technically able to run on most Sony devices from 2011 onwards, please contact them for more detailed information.

### **Question:** Does the TV Application Layer work on Samsung TVs and Blu-ray players?
**Answer:** TAL is technically able to run on most Samsung devices from 2010 onwards, please contact them for more detailed information.

### **Question:** How do I submit a device configuration file for the 'ACME 2013' device?
**Answer:** Using one of the existing device configuration files as a guide:

* Create a a file in the format BRAND-MODEL-default.json (where BRAND is the relevant Manufacturer name and 
MODEL refers to all the devices the config applies to). Typically a manufacturer will use
similar hardware and browser across a whole range of devices from a manufacturer.
* Update the JSON file to reflect the appropriate choices for that device or device range. See [explanation](overview/device-configuration.html)
* Contribute the change back by following our [contributors page](other/contributing.html).

### **Question:** As a manufacturer that already has iPlayer running on my device how do we make our device available on TAL?
**Answer:** We ask all manufacturers for permission to share the device configuration file specific to their device.
If you haven't completed the waiver document and want to then please fill out and return the [waiver]({{site.baseurl}}/other/tal-waiver.pdf)

### **Question:** How does the right device configuration get chosen for each device?
**Answer:** Internally the BBC has a database that matches device-browser user-agents to device-configuration files 
(BRAND-MODEL-default.json), but that is not part of what is being shared here.  See the
[SampleApplication](https://github.com/fmtvp/talexample) for an alternative approach to
doing it.  The sample application works by specifying the device config file as a URL
parameter, but its up to you how you do it.

### **Question:** What is the database that the BBC uses?
**Answer:** The BBC uses its own internal database, which is based on the WURFL project.

### **Question:** What gets specified in a device configuration file?  
**Answer:** See the [device configuration](overview/device-configuration.html) page for specific details.

### **Question:** Does TAL support any DRM solutions?  
**Answer:** Currently it doesn't, but the TAL project has talked to several DRM providers who are interested 
in looking at integrating their solutions with TAL.

### **Question:** Is TAL trying to enforce any standards?
**Answer:** TAL has been built pragmatically. We've followed standards where possible and tried to 
encourage manufacturers to do the same, but where its not possible for some reason, we may solve the 
problem creatively. We provide implementations of abstractions complying with 
industry standards (W3C, HbbTV, DTG). For example, TAL abstracts the W3C and CE-HTML specifications which 
achieve the common goal of media playback.

### **Question:** Does TAL support HbbTVs?
**Answer:** Yes, we've included a default configuration file in the TAL project code.

### **Question:** What is ANTIE?
**Answer:** You will see ANTIE throughout the code.  It's the just the original code
name for the project, before it became TAL.

### **Question:** I have a query, who can I send it to?  
**Answer:** Please see the [contributing](other/contributing.html) page to see how to get in touch.
