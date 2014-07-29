require.def(
	'antie/devices/exit/samsung_maple',
	['antie/devices/browserdevice'],
	function(Device) {

        /**
	     * Exits the application by navigating to the first page in the browsers history.
	    */
        Device.prototype.exit = function() {
           new Common.API.Widget().sendReturnEvent();
        }

    }
);
