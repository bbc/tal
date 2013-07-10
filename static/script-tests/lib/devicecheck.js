/*
 *
 * Return (Bool) True if test can be run on this device, otherwise false
 */
var devicecheck = function(config) {

    if(config === undefined){
        return true;
    }

    var runningDeviceConfiguration= window.deviceConfig;

    // Check the modules
    for(var p0 in config.modules.modifiers ) {

        if( config.modules.modifiers[ p0 ] === 'antie/devices/data/json2' || config.modules.modifiers[ p0 ] === 'antie/devices/data/nativejson' ){
            continue;
        }

        var bFound = false;
        for( var p1 in runningDeviceConfiguration.modules.modifiers ){
            if( config.modules.modifiers[ p0 ] === runningDeviceConfiguration.modules.modifiers[ p1 ] ){
                bFound = true;
                break;
            }
        }

        if( bFound === false ){
            jstestdriver.console.warn( config.modules.modifiers[ p0 ] + " modfier not found" );
            jstestdriver.console.warn("this test can not be run on this device");
            return false;
        }
    }

    return true;
}