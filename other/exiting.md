---
layout: default
title: Exiting an Application
---
# Exiting an Application

<p class="lead">The framework has a method you may call to exit the application, or return to the TAL application that launched yours.</p>

## Returning to a previous TAL application

The framework is capable of launching new TAL applications and returning through them. It maintains a history stack automatically that's passed from application to application. For information on how to launch a new TAL application in a way that generates the history stack and provides other convenient functionality, see the page on [Launching](launching.html).

To check whether the framework knows about a previous TAL application, obtain a reference to the current application and use:
{% highlight javascript %}
application.hasHistory();
{% endhighlight %}

The `hasHistory()` function returns `True` if there is at least one previous TAL application in the history stack.

To return to the last application in the history, use the `back()` function on the current application:
{% highlight javascript %}
application.back();
{% endhighlight %}

It is safe to call `back()` even if there's no history. In this case, it will work the same as `exit()` (see below).

## Exiting to broadcast or the widget page

To exit the running application and return to the broadcast or widget page from which it was launched, use the `exit()` function on the current application.

Obtain a reference to the current application, then call the function `exit()`:
{% highlight javascript %}
application.exit();
{% endhighlight %}

You can check to see if the device supports exiting by obtaining a reference to the device object, then calling:

{% highlight javascript %}
if(device.exit !== Device.prototype.exit) {
/* code to execute when exit() is supported */
};
{% endhighlight %}
