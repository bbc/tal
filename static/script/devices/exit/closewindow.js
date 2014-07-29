require.def(
	'antie/devices/exit/closewindow',
	['antie/devices/browserdevice'],
	function(Device) {

        /**
	     * Exits the application by invoking the window.close method
	    */
        Device.prototype.exit = function() {
            window.close();
        }

    }
);
