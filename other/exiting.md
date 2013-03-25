---
layout: default
title: Exiting an Application
---
# Exiting an Application

<p class="lead">The framework provides a method you may call to exit the application back to the location that launched your application.</p>

To exit the application, obtain a reference to the device, then call the function `exit()`:
{% highlight javascript %}
device.exit();
{% endhighlight %}

You can check to see if the device supports exiting by calling:

{% highlight javascript %}
if(device.exit !== Device.prototype.exit) {
/* code to execute when exit() is supported */
};
{% endhighlight %}