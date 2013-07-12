/*
 *
 * Return (Bool) True if test can be run on this device, otherwise false
 */

var onDeviceTestConfigValidation = {
    removeTestsForIncompatibleDevices : function( modifiers, testObject ){

        if( !window.testOnDevice ){
            return;
        }

//        console.log( "****TESTREMOVE****" );
//        console.log( window.deviceConfig );
//        console.log( "****MODIFIERS****" );
//        console.log( modifiers );

        for( var m0 in modifiers ){
            //look for each modifier in the actual device configuration
            if(  window.deviceConfig.modules.modifiers.indexOf( modifiers[ m0 ] ) == -1 ){
                //if a modifier is not found then this is not a valid test
                for( var tr in testObject.prototype ){
                    if( tr.indexOf( "test" ) === 0 ){
                        delete testObject.prototype[ tr ];
                        console.log( "removing tests " + tr );
                        jstestdriver.console.log( "removing tests " + tr );
                    }
                }
            }
        }
    }
}

