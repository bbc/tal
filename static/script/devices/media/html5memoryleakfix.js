require.def(
	'antie/devices/media/html5memoryleakfix',
	[
		'antie/devices/media/html5'
	],
	function (HTML5Player) {

		HTML5Player.prototype._requiresWebkitMemoryLeakFix = function() {
			return true;
		};

		return HTML5Player;
	}
);
