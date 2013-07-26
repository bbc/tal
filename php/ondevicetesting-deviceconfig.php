<?php
/* a php endpoint to deliver device configs to be used when running JavaScript tests on devices
*/

if( !isset( $_GET[ 'brand' ] ) ){
    echo  "Brand not set";
    exit();
}

if( !isset( $_GET[ 'model' ] ) ){
    echo  "Model not set";
    exit();
}

$brand = $_GET[ 'brand' ];
$model = $_GET[ 'model' ];

$path_to_file = "../config/devices/$brand-$model-default.json";
$config = @file_get_contents( $path_to_file );

if( $config == FALSE ){
    echo  "Can not load device config: $path_to_file";
    exit();
}

echo "window.deviceConfig=$config;";


