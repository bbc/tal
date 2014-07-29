require(["antie/events/mediaevent"],
	function(MediaEvent){
		var realConstructor = MediaEvent.prototype.init;
		MediaEvent.prototype.init = function(type, target) {
			XMPP.sendVideoEvent({
				type : type,
				url : target.getCurrentSource(),
				timestamp : new Date() * 1
			});
			realConstructor.apply(this, arguments);
		}
	}
);