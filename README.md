# TAL -- TV Application Layer

![TAL](https://bbc.github.io/tal/img/tal-logo-bw-small.jpg)

![maintenance-status](https://img.shields.io/badge/maintenance-deprecated-red.svg)
[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

[![Build Status](https://travis-ci.org/bbc/tal.svg?branch=master)](https://travis-ci.org/bbc/tal/branches)
[![npm version](https://badge.fury.io/js/tal.svg)](https://badge.fury.io/js/tal)


---
## TAL Replacement update 28/09/2023

We are working towards an approach of modular packages focused on specific features such as playback, navigation, and device abstraction. We do not intend to provide a UI framework, and these packages should work with a number of front-end frameworks. As part of this work, we are in the process of making internal TV packages open source. Some of these have been released already including:

- [Bigscreen Player](https://github.com/bbc/bigscreen-player)
- [LRUD Spatial](https://github.com/bbc/lrud-spatial)
- [Melanite](https://github.com/bbc/melanite)

Looking further to the future, we are developing an open source demo app, including associated documentation. This will enable the wider community to understand how these packages work together to build a TV application.
## Contact us at BBC TV Open Source 20/03/2023

We have now created a mailbox where you can [contact us](mailto:tvopensource@bbc.co.uk) with any questions related to TAL or the
future of this project. We aim to respond to emails within a week. We hope to share some details of the replacement to TAL soon.

## Deprecation Announcement 12/12/2022

Today we are announcing the deprecation of *TAL*. This will allow us to concentrate on future work, which
we hope to share details of soon.

We apologise that we were not active in keeping the TAL community up to date with the status of the
project. Going forward, we will provide regular updates on the future of *TAL*.

As part of the deprecation, pull requests will be disabled and outstanding issues will be closed.
TAL will not be actively maintained.

We will answer any questions found in the issues backlog as best we can. There will soon be a email address you
can use to contact us. This readme will be updated when this becomes available.

---

*TAL* was developed internally within the BBC as a way of vastly simplifying TV application development
whilst increasing the reach of BBC TV applications such as *iPlayer*. Today all of the BBC's HTML-based
TV applications are built using *TAL*.

There are hundreds of different devices in the marketplace and they all use slightly different technologies
to achieve the same result. The purpose of TAL is to allow you to write an application once, and be confident
that it can be deployed to all HTML-based TV devices.

[View the latest release here.](https://github.com/bbc/tal/releases/latest)

## Documentation

All our documentation is hosted on [GitHub pages](https://bbc.github.io/tal/). Take a look at
our [faq](https://bbc.github.io/tal/faq.html) for some high-level information, or dive straight into our
[javascript documentation](https://bbc.github.io/tal/jsdoc/) for our code reference docs.

We also have a [sample application](https://github.com/fmtvp/talexample) that you can use as a guide to
help you build your own applications.

## License

TAL is available to everyone under the terms of the Apache 2.0 open source licence. Take a look at
the LICENSE file in the code, and read our [faq](https://bbc.github.io/tal/faq.html#question_who_can_use_this)
and [documentation](https://bbc.github.io/tal/other/contributing.html) to learn how to contribute.


## Testing

For developers who want to modify and contribute to TAL, we have a page on [testing](https://bbc.github.io/tal/testing.html) which you should follow before starting development.

## Releasing (FOR MAINTAINERS)

See https://confluence.dev.bbc.co.uk/display/tvpjsfrmwk/TAL+Deployment+Process+for+Cosmos.
