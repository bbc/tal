<?php 
require_once('../0.1.3/antieframework.php');
require_once('brandandmodel.php');

$framework = new AntieFramework();
$brandandmodel = new BrandAndModel();

function getDeviceBrandAndModel() {
	$ua = $_SERVER['HTTP_USER_AGENT'];
	switch ($ua) {
		case (preg_match('?^Mozilla/5.0 \(PLAYSTATION 3?', $ua) ? true : false):
		case (preg_match('?Mozilla/4.0 \(PS3 \(PlayStation 3\); 1.00\)?', $ua) ? true : false):
			return array('Sony', 'Playstation 3');
			break;
		case (preg_match('?Chrome/?', $ua) ? true : false):
			return array('Chrome', '1 0');
			break;
		default:
			return array('', '');
			break;
	}
}
$returnBrandAndModel = getDeviceBrandAndModel();
$brandandmodel->setBrand($returnBrandAndModel[0]);
$brandandmodel->setModel($returnBrandAndModel[1]);

$applicationKey = $framework::normaliseKeyNames($brandandmodel->getBrand())."-". $framework::normaliseKeyNames($brandandmodel->getModel());
$applicationConfig = $framework->getConfigurationFromFilesystem($applicationKey, "applicationconfig");

$applicationConfigJSON = json_decode($applicationConfig);

$deviceKey = $applicationConfigJSON->deviceConfigurationKey;
$deviceConfigJSON = json_decode($framework->getConfigurationFromFilesystem($deviceKey,"deviceconfig"));

$mergedconfiguration = $framework::mergeConfigurations($deviceConfigJSON, $applicationConfigJSON);
$mergedConfig = json_encode($mergedconfiguration);
?>

<?= $framework->getDocType($brandandmodel->getBrand(),$brandandmodel->getModel()) ?>
	<head>
        <?= $framework->getDeviceHeaders($brandandmodel->getBrand(),$brandandmodel->getModel()) ?>
		<script type="text/javascript">
        	var antie = {
        		framework: {
	       			deviceConfiguration: <?= $mergedConfig ?>
        		}
        	};
        </script>

        <script type="text/javascript">
		  var require = {
			  baseUrl: "",
			  paths: {
				  frameworkdemo: "http://pal.sandbox.dev.bbc.co.uk/antie/frameworkdemo/script",
				  antie: "http://static.sandbox.dev.bbc.co.uk/antie/script"
			  },
			  priority: [
			  ],
			  callback: function() {
				  // Add the static host URL to JS configuration here
			  }
		  };
	   </script>
	   <script type="text/javascript" src="http://static.sandbox.dev.bbc.co.uk/antie/script/lib/require.js"></script>
	   <link rel="stylesheet" href="http://pal.sandbox.dev.bbc.co.uk/antie/frameworkdemo/style/base.css"/>
	</head>

	<body scroll="no">
        <?= $framework->getDeviceBody($brandandmodel->getBrand(),$brandandmodel->getModel()); ?>

           <script type="text/javascript">
	  require(
		  [
			  "frameworkdemo/carouselapplication"
		  ],
		  function(DialogApplication) {
			  require.ready(function() {
			  	  function onReady() {
			  	  }
				  new DialogApplication(
					  document.getElementById('app'),
					  "http://pal.sandbox.dev.bbc.co.uk/antie/frameworkdemo/style/",
					  "http://pal.sandbox.dev.bbc.co.uk/antie/frameworkdemo/img/",
					  onReady
				  );
			  });
		  }
	  );
    </script>
    <div id="app"></div>      
	</body>

</html>
