/*
 *
 * Return (Bool) True if test can be run on this device, otherwise false
 */

var onDeviceTestConfigValidation = {
    removeTestsForIncompatibleDevices : function( modifiers, testObject ){

        //this indicates we are testing on a device and want to exclude tests based on configs
        if( !window.deviceConfig ){
            return;
        }

        for( var m0 in modifiers ){
            //look for each modifier in the actual device configuration
            if(  window.deviceConfig.modules.modifiers.indexOf( modifiers[ m0 ] ) == -1 ){
                //if a modifier is not found then this is not a valid test
                for( var tr in testObject.prototype ){
                    if( tr.indexOf( "test" ) === 0 ){
                        delete testObject.prototype[ tr ];
                        jstestdriver.console.log( "modifier " + modifiers[ m0 ] + " not found. removing tests " + tr );
                    }
                }
            }
        }
    }
}

