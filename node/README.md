# TAL for node.js

## How to use it

To create a new object you have to indicate the `configPath` and the `frameworkPath` that's the main diference between the original PHP implementation and this one.

### Constructor

```javascript
var configPath = "config/";
var frameworkPath = "config/framework/";
var antie = require("node/antieframework");

var antie = new AntieFramework(configPath, frameworkPath);
```

### Getting the MimeType
`deviceConfig` - (object)  The device configuration information.
```javascript
antie.getMimeType(deviceConfig); // returns a string
```

### Getting the DocType
`deviceConfig` - (object) The device configuration information.
```javascript
antie.getDocType(deviceConfig); // returns a string
```

### Getting the Root HTML Tag
`deviceConfig` - (object) The device configuration information.
```javascript
antie.getRootHtmlTag(deviceConfig); // returns a string
```

### Getting the Device Headers
`deviceConfig` - (object) The device configuration information.
```javascript
antie.getDeviceHeaders(deviceConfig); // returns a string
```

### Getting the Device Body
`deviceConfig` - (object) The device configuration information for.
```javascript
antie.getDeviceBody(deviceConfig); // returns a string
```

### Normalising key names
`normString` - (string) to be normalized
```javascript
antie.normaliseKeyNames(normString); // returns a string
```

### Getting configuration from file system
* `key` - (string) The unique device identifier, typically brand-model.
* `type` - (string) The this._configPath sub-directory where the device configuration is located.

```javascript
antie.getConfigurationFromFilesystem(key , type); // returns a string
```

### Getting Page Strategy Element
* `pageStrategy` - (string) The page strategy used by this device.
* `element` - (string) The page strategy property to return (Sub-directory of _configpath/pagestrategy directory).
* `defaultValue` - (string) The default value to return if the page strategy does not contain the requested element.

```javascript
antie.getPageStrategyElement(pageStrategy, element, defaultValue; // returns a string
```

### Merging configurations
* `originalConfiguration` - (object) The device configuration information.
* `patchConfiguration` - (object) Device configuration override properties.

```javascript
antie.mergeConfigurations(originalConfiguration, patchConfiguration); // returns an object
```

# More Information
You can get more examples in the unit-tests file https://github.com/landeiro/tal/blob/master/node-test/antieframeworktest.js and in a great working example made by Shawn Price here https://github.com/sprice/talexample
