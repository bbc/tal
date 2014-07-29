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
