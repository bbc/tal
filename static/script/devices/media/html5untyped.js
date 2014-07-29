require.def(
	'antie/devices/media/html5untyped',
	[
		'antie/devices/media/html5'
	],
	function (HTML5Player) {

		HTML5Player.prototype._supportsTypeAttribute = function() {
			return false;
		};

		return HTML5Player;
	}

);
