/**
 * @fileOverview Requirejs module containing the antie.widgets.Widget abstract base class.
 * @author Chris Warren <chris.warren@bbc.co.uk>
 * @version 1.0.0
 */

/**
 * User interface widgets.
 * @name antie.widgets
 * @namespace
 */

require.def('antie/widgets/widget',
	[
	 	'antie/class',
	 	'require',
	 	'antie/application'
	],
	function(Class, require, Application) {
		/** 
		 * Keep a count of generated IDs so we can ensure they're always unique
		 * @private
		 */
		var widgetUniqueIDIndex = 0;

		/**
		 * The base widget class. A widget is a UI-component which can be rendered to device-specific output
		 * via a {@link antie.devices.Device} object.
		 * @name antie.widgets.Widget
		 * @class
		 * @abstract
		 * @extends antie.Class
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 */
		return Class.extend(/** @lends antie.widgets.Widget.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id) {
				this._classNames = {"widget":true};
				this.parentWidget = null;
				this.outputElement = null;
				this._eventListeners = {};
				this._dataItem = null; 	// Any data item bound to this widget
				this._isFocussed = false;

				function createUniqueID() {
					return "#" + (new Date()*1) + "_" + (widgetUniqueIDIndex++);
				};

				// ensure all widgets have an ID
				this.id = id ? id : createUniqueID();
			},
			/**
			 * Renders the widget to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				throw new Error("Widget::render called - the subclass for widget '" + this.id + "' must have not overridden the render method.");
			},
			/**
			 * Adds a class to the widget.
			 * @param {String} className The class name to add.
			 */
			addClass: function(className) {
				if(!this._classNames[className]) {
					this._classNames[className] = true;
					if(this.outputElement) {
						var device = this.getCurrentApplication().getDevice();
						device.setElementClasses(this.outputElement, this.getClasses());
					}
				}
			},
			/**
			 * Removes a class from the widget.
			 * @param {String} className The class name to remove.
			 */
			removeClass: function(className) {
				if(this._classNames[className]) {
					delete(this._classNames[className]);
					if(this.outputElement) {
						var device = this.getCurrentApplication().getDevice();
						device.setElementClasses(this.outputElement, this.getClasses());
					}
				}
			},
			/**
			 * Checks to see if the widget has a given class.
			 * @param {String} className The class name to check.
			 * @returns Boolean true if the device has the className. Otherwise boolean false.
			 */
			hasClass: function(className) {
				return (this._classNames[className] ? true : false);
			},
			/**
			 * Get an array of class names that this widget has.
			 * @returns An array of class names (Strings)
			 */
			getClasses: function() {
				var _names = [];
				for(var i in this._classNames) {
					_names.push(i);
				}
				return _names;
			},
			/**
			 * Add an event listener function to this widget.
			 * @param {String} ev The event type to listen for (e.g. <code>keydown</code>)
			 * @param {Function} func The handler to be called when the event is fired.
			 * @see antie.events.Event
			 */
			addEventListener: function(ev, func) {
				var listeners = this._eventListeners[ev];
				if(!listeners) {
					listeners = this._eventListeners[ev] = {};
				}
				if(!listeners[func]) {
					listeners[func] = func;
				}
			},
			/**
			 * Removes an event listener function to this widget.
			 * @param {String} ev The event type that the listener is to be removed from (e.g. <code>keydown</code>)
			 * @param {Function} func The handler to be removed.
			 * @see antie.events.Event
			 */
			removeEventListener: function(ev, func) {
				var listeners = this._eventListeners[ev];
				if(listeners && listeners[func]) {
					delete(listeners[func]);
				}
			},
			/**
			 * Fires an event on this object, triggering any event listeners bound to this widget only.
			 * Note: this does not bubble or propagate the event to other widgets, for that functionality
			 * see {@link #bubbleEvent}.
			 * @param {antie.events.Event} ev The event to fire.
			 * @see antie.events.Event
			 */
			fireEvent: function(ev) {
				var listeners = this._eventListeners[ev.type];
				if(listeners) {
					for(var func in listeners) {
						try {
							listeners[func](ev);
						} catch (exception) {
							var logger = this.getCurrentApplication().getDevice().getLogger();
							logger.error("Error in " + ev.type + " event listener on widget " + this.id + ": " + exception.message, exception, listeners[func]);
						}
					}
				}
			},
			/**
			 * Bubbles an event from object, triggering any event listeners bound to this widget and any
			 * parent widgets.
			 * To halt bubbling of the event, see {@link antie.events.Event#stopPropagation}.
			 * @param {antie.events.Event} ev The event to bubble.
			 * @see antie.events.Event
			 */
			bubbleEvent: function(ev) {
				this.fireEvent(ev);
				if(!ev.isPropagationStopped()) {
					if (this.parentWidget != null) {
						this.parentWidget.bubbleEvent(ev);
					} else {
						ev.stopPropagation();
					}
					
				}
			},

			/**
			 * Broadcast an event from object, triggering any event listeners bound to this widget and any
			 * parent widgets.
			 * To halt bubbling of the event, see {@link antie.events.Event#stopPropagation}.
			 * @param {antie.events.Event} ev The event to bubble.
			 * @see antie.events.Event
			 */
			broadcastEvent: function(ev) {
				this.fireEvent(ev);
			},

			/**
			 * Checks to see if a widget is focussable, i.e. contains an enabled button.
			 * @see antie.widgets.Button
			 */
			isFocusable: function() {
				// a widget can receive focus if any of it's children or children-of-children are Buttons
				// We're not a button and we have no children, so we're not.
				return false;
			},
			/**
			 * Gets a reference to the application responsible for creating the widget.
			 * @see antie.Application
			 */
			getCurrentApplication: function() {
				try {
					if(!Application) Application = require('antie/application');
					return Application.getCurrentApplication();
				} catch (ex) {
					return null;
				}
			},
			/**
			 * Get any data item associated with this widget.
			 */
			getDataItem: function() {
				return this._dataItem;
			},
			/**
			 * Associate a data item with this widget.
			 * @param {object} dataItem Object to associate with this widget.
			 */
			setDataItem: function(dataItem) {
				this._dataItem = dataItem;
			},
			/**
			 * Returns the component this widget is a descendant of
			 */
			getComponent: function() {
				var Component = require('antie/widgets/component');
				var widget = this;
				while(widget && !(widget instanceof Component)) {
					widget = widget.parentWidget;
				}
				return widget;
			},
			/**
			 * Remove focus state from this widget.
			 */
			removeFocus: function() {
				this.removeClass('focus');
				this._isFocussed = false;
			},
			/**
			 * Get if this widget is in the current focus path.
			 * @returns Boolean true if this widget is in the focus path, otherwise false.
			 */
			isFocussed: function() {
				return this._isFocussed;
			}
		});
	}
);
