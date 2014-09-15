
require.def(
    'antie/devices/exit/tivo',
    ['antie/devices/browserdevice'],
    function(Device) {
        'use strict';

        /**
         * Exits the application by returning to the widget page using the tivo function.
         */
        Device.prototype.exit = function() {
            tivo.core.exit();
        };

    }
);
