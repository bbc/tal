---
layout: default
title: Launching Other TAL Applications
---
# Launching Other TAL Applications

<p class="lead">The framework can launch other TAL applications, preserving URL query parameters and maintaining a history stack.</p>

To launch a new TAL application by URL, obtain a reference to the Application object, 
then call the function `launchAppFromURL()`:
{% highlight javascript %}
application.launchAppFromURL('http://www.example.com/talapp/');
{% endhighlight %}

It's also possible to pass additional query parameters to the new application. Query 
parameters passed to the existing application will be preserved and passed to the new 
application by default. To overwrite them with your query parameters instead,  pass 
`True` to `launchAppFromURL()` as the optional fourth parameter.

This example demonstrates how to relaunch the same application with an additional 
query parameter `mode` and a route in the new application:

{% highlight javascript %}
application.launchAppFromURL(application.getCurrentAppURL(), {mode: 'test'}, ['main', 'favourites']);
{% endhighlight %}

History is automatically maintained and passed between TAL applications. For 
information on how to use it to navigate backwards, see the section on 
[exiting](exiting.html).

## Gain access to existing query parameters

Existing URL query parameters passed to the current application can be obtained as a 
JSON object by using `getCurrentAppURLParameters()`. For example:
{% highlight javascript %}
var params = application.getCurrentAppURLParameters();
if (params.mode === 'test') {
    ...
}
{% endhighlight %}

Remember that by default, query parameters passed to `launchAppFromURL()` are merged 
with existing ones, so there's no need to use `getCurrentAppURLParameters()` to do 
the merging explicitly.
