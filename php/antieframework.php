<?php
/**
 * @package BBC_AntieFramework
 */
/**
 * The AntieFramework Class
 *
 * A collection of helper functions for constructing a HTTP response and appropriate HTML markup suitable
 * for TV Applications.
 *
 * @copyright Copyright (c) 2013 British Broadcasting Corporation
 * (http://www.bbc.co.uk) and TAL Contributors (1)
 *
 * (1) TAL Contributors are listed in the AUTHORS file and at
 *     https://github.com/fmtvp/TAL/AUTHORS - please extend this file,
 *     not this notice.
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * All rights reserved
 * Please contact us for an alternative licence
 */


class AntieFramework {
	
	private $_configPath;

    /**
     * The class constructor.
     *
     * Sets the config path used to locate pageStrategy elements, defaults to the current working directory if no config
     * path is provided.
     * @param string|bool $configPath The directory path to the antie config directory.
     */
	public function __construct($configPath = false) {
		if($configPath) {
			$configPath .= "/";
		}
		$this->_configPath = $configPath;
	}

    /**
     * Returns the doctype required by this device. The doctype is used in the returned HTML page.
     *
     * @param object $deviceConfig The device configuration information for the device that made the request.
     * @return string The doctype associated with this device.
     */
	public function getDocType($deviceConfig) {
        $devicePageStrategy = $deviceConfig->pageStrategy;
        return $this->getPageStrategyElement( $devicePageStrategy, 'doctype', '<!DOCTYPE html>' );
	}

    /**
     * Returns The mimetype that needs to be associated with the HTTP response for this device.
     *
     * @param object $deviceConfig The device configuration information for the device that made the request.
     * @return string The HTTP mimetype required by this device. If this value is not found in the page strategy
     * default return value is 'text/html'.
     */
    public function getMimeType($deviceConfig){
    	$devicePageStrategy = $deviceConfig->pageStrategy;
    	return $this->getPageStrategyElement( $devicePageStrategy, 'mimetype', 'text/html');
    }

    /**
     * Returns the root HTML tag to be used in the HTML response.
     *
     * @param object $deviceConfig The device configuration information for the device that made the request.
     * @return string The root HTML element required by this device. If this value is not found in the page strategy
     * default return value is <html>.
     */
    public function getRootHtmlTag($deviceConfig) {
    	$devicePageStrategy = $deviceConfig->pageStrategy;
    	return $this->getPageStrategyElement( $devicePageStrategy, 'rootelement', '<html>');
    }

    /**
     * Returns any extra HTML content that the device requires to be placed in the HTML <head>.
     *
     * @param object $deviceConfig The device configuration information for the device that made the request.
     * @return string The HTML content to be placed in the HTML <head>.
     */
	public function getDeviceHeaders($deviceConfig) {
		$devicePageStrategy = $deviceConfig->pageStrategy;
		return $this->getPageStrategyElement( $devicePageStrategy, 'header', "" );
	}

    /**
     * Returns any extra HTML content that the device requires to be placed in the HTML <body>.
     *
     * @param object $deviceConfig The device configuration information for the device that made the request.
     * @return string The HTML content to be placed in the HTML <body>.
     */
	public function getDeviceBody( $deviceConfig) {
		$devicePageStrategy = $deviceConfig->pageStrategy;
		return $this->getPageStrategyElement( $devicePageStrategy, 'body', "" );
	}

    /**
     * Replaces whitespace with underscores and lowercases all uppercase characters. Used to compare strings where
     * capitalization is not guaranteed.
     *
     * @static
     * @param string $value The value to be normalized.
     * @return string The normalized value.
     */
	public static function normaliseKeyNames($value) {
		return strtolower(preg_replace("/[^a-zA-Z0-9]/m", "_", $value));
	}

    /**
     * Returns a JSON formatted device configuration from the file system
     *
     * @param $key The unique device identifier, typically brand-model.
     * @param $type The $_configPath sub-directory where the device configuration is located.
     * @return string of JSON. Empty string if not found.
     */
	public function getConfigurationFromFilesystem($key, $type) {
		$configurationJSON = "";
		$configurationPath = $this->_configPath."$type/$key.json";
		
		$configurationJSON = @file_get_contents($configurationPath, FILE_USE_INCLUDE_PATH);
		return $configurationJSON;
	}

    /**
     * Returns an element (property) of the page strategy or the provided default value.
     *
     * The page strategy is used to determine the value of various properties to be used in the HTTP response depending
     * on the class of device. This is required to support multiple specification standards such as HTML5, PlayStation 3,
     * HBBTV and Maple.
     *
     * The page strategy elements are contained in a directory structure located in $this->_configpath/pagestrategy.
     *
     * Typical page strategy elements include: the HTTP header mimetype property, HTML doctype, HTML head, HTML root
     * element & HTML body. For example the HTML <head> and <body> may need to contain vendor specific code/markup.
     *
     * @param string $pageStrategy The page strategy used by this device.
     * @param string $element The page strategy property to return (Sub-directory of $this->_configpath/pagestrategy
     * directory).
     * @param string $default The default value to return if the page strategy does not contain the requested element.
     * @return string An element (property) of the page strategy or the default value.
     */
	public function getPageStrategyElement( $pageStrategy, $element, $default )
	{
		$returnFile = @file_get_contents( $this->_configPath."pagestrategy/$pageStrategy/$element", FILE_USE_INCLUDE_PATH );
		return $returnFile ? $returnFile : $default;
	}

    /**
     * Returns a device configuration that includes any overridden properties defined in the supplied patch object.
     *
     * @static
     * @param object $original The device configuration information for the device that made the request.
     * @param object $patch Device configuration override properties.
     * @return object The original device configuration along with any overridden properties as defined in the patch
     * object.
     */
	public static function mergeConfigurations($original, $patch) {
		foreach ($patch as $key => $value) {
			if (property_exists($original, $key) && is_object($original->{$key}) && is_object($value)){
				$original->{$key} = self::mergeConfigurations($original->{$key}, $value);
			}
			else {
				$original->{$key} = $value;
			}
		}
		return $original;
	}
}