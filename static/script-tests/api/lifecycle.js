/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

var LifecycleApi = {

  restart : function() {
	XMPP.stopConsumingMessages();
	window.location.hash = "";
    window.location.reload(true);
  },
  
  redirect : function(to) {
      XMPP.stopConsumingMessages();
      window.location.href = to;
  },

  ping : function() {
    return true;
  },

  start : function(arg, returnfunction, asyncflag) {
      require(["antie/application"], function(Application) {
               Application.prototype.forcedApplicationStart.apply();
               returnfunction(true);
          }
      );
      return asyncflag;
  }
};
