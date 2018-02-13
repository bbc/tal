/**
 * @fileOverview Requirejs module containing antie.Class top-level base class.
 *
 * @see https://medium.com/netflix-techblog/improving-the-performance-of-our-javascript-inheritance-model-af376d75665
 */

define('antie/class', function() {
    var initializing = false;

    // The base Class implementation (does nothing)
    var Class = function(){};

    // Create a new Class that inherits from this class
    Class.extend = function extend(prop) {
        var _super = this.prototype;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            if (prop.hasOwnProperty(name)) {
                // if we're overwriting an existing function
                // set the base property
                var value = prop[name];
                if (typeof prop[name] === 'function' && typeof _super[name] === 'function'){
                    value.base = _super[name];
                }
                prototype[name] = value;
            }
        }

        // The dummy class constructor
        function Class() {
            // All construction is actually done in the init method
            if (!initializing && this.init) {
                this.init.apply(this, arguments);
            }
        }

        // Populate our constructed prototype object
        Class.prototype = prototype;

        // Enforce the constructor to be what we expect
        Class.prototype.constructor = Class;

        // And make this class extendable
        Class.extend = arguments.callee;

        return Class;
    };

    return Class;
});
