require.def(
	'antie/devices/media/html5waitingfix',
	[
		'antie/devices/media/html5',
		'antie/events/mediaevent'
	],
	function (HTML5Player, MediaEvent) {

		var originalConstructor = HTML5Player.prototype.init;
		HTML5Player.prototype.init = function(id, mediaType) {
			originalConstructor.call(this, id, mediaType);

			var checkWaitingTimer = null;
			var waiting = false;

			var self = this;
			this.addEventListener('pause', function(evt) {
				window.clearTimeout(checkWaitingTimer);
			});
			this.addEventListener('timeupdate', function(evt) {
				if(checkWaitingTimer) {
					window.clearTimeout(checkWaitingTimer);
				}
				checkWaitingTimer = window.setTimeout(function() {
					waiting = true;
					self.fireEvent(new MediaEvent("waiting"));
				}, 500);
				if(waiting) {
					waiting = false;
					self.fireEvent(new MediaEvent("playing"));
				}
			});
			this.addEventListener('ended', function(evt) {
				if(checkWaitingTimer) {
					window.clearTimeout(checkWaitingTimer);
				}
			});
		};

		return HTML5Player;
	}

);
