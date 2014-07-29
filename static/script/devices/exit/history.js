require.def(
	'antie/devices/exit/history',
	['antie/devices/browserdevice'],
	function(Device) {

        /**
	     * Exits the application by navigating to the first page in the browsers history.
	    */
        Device.prototype.exit = function() {
            var startPage = history.length -1;
            history.go(-startPage); 
        }

    }
);
