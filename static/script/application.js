/**
 * @fileOverview Requirejs module containing the antie.Application class.
 *
 * @preserve Copyright (c) 2013 British Broadcasting Corporation
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

require.def('antie/application',
	[
	 	'antie/class',
	 	'antie/widgets/componentcontainer',
		'antie/widgets/button',
		'antie/widgets/list',
		'antie/devices/device'
	],
	function(Class, ComponentContainer, Button, List, Device) {
		/**
		 * Contains a reference to the single instance of the antie.Application class.
		 * @private
		 */
		var applicationObject;

		/**
		 * Abstract base class for Bigscreen applications.
		 * @name antie.Application
		 * @class
		 * @abstract
		 * @extends antie.Class
		 * @requires antie.widgets.ComponentContainer
		 * @requires antie.widgets.List
		 * @param {DOMElement} rootElement DOMElement into which to render the application.
		 * @param {String} styleBaseURL URL pointing to path stylesheets are relative to.
		 * @param {String} imageBaseURL URL pointing to path images are relative to.
		 * @param {function(Event)} onReadyHandler Function called when application is ready.
		 * @param {Object} [configOverride] Optional config to override default.
		 */
		var Application = Class.extend(/** @lends antie.Application.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(rootElement, styleBaseUrl, imageBaseUrl, onReadyHandler, configOverride) {
				if(applicationObject) {
					throw new Error("Application::init called for a second time. You can only have one application instance running at any time.");
				}
				this._rootElement = rootElement;
				this._rootWidget = null;
				this._focussedWidget = null;
				this._onReadyHandler = onReadyHandler;

				applicationObject = this;

				var self = this;

				var _configuration = configOverride || antie.framework.deviceConfiguration;
				if(!this._device) {
					Device.load(_configuration, {
						onSuccess: deviceLoaded,
						onError: function(err) {
							console.error("Unable to load device", err);
						}
					});
				} else {
					deviceLoaded(this._device);
				}
				function deviceLoaded(device) {
				    var i;
					self._device = device;
					device.setApplication(self);
					device.addKeyEventListener();
					var _layout = self.getBestFitLayout();
					_layout.css = _layout.css || [];
					if (_configuration.css){
						for ( i = 0; i < _configuration.css.length; i++){
							if  (  _configuration.css[i].width == _layout.width
								&& _configuration.css[i].height == _layout.height){
								_layout.css = _layout.css.concat(_configuration.css[i].files);
							}
						}
					}
					
					require([_layout.module], function(layout) {
						self.setLayout(layout, styleBaseUrl, imageBaseUrl, _layout.css, _layout.classes, [], function() {
							self.run();
							self.route(device.getCurrentRoute());
						});
					});
				}
			},
			/**
			 * Called once application startup is ready (i.e. config has been loaded).
			 */
			run: function() {
				// intentionally left blank
			},
			/**
			 * Must be called when the application startup is complete and application can accept user input.
			 */
			ready: function() {
				if(this._onReadyHandler) {
					var self = this;
					// Run this after the current execution path is complete
					window.setTimeout(function() {
						self._onReadyHandler(self);
					}, 0);
				}
			},
			/**
			 * Gets the largest supported layout that fits within the available screen resolution.
			 * @returns An object literal describing which layout module to load.
			 */
			getBestFitLayout: function() {
			    var i;
				var _screenSize = this._device.getScreenSize();
				var _layouts = this._device.getConfig().layouts;

				// sort the layouts by largest first
				_layouts.sort(function(a, b) {
					var	ad = (a.width*a.width) + (a.height*b.height),
						bd = (b.width*b.width) + (b.height*b.height);
					if(ad == bd) return 0;
					else if(ad < bd) return 1;
					else return -1;
				});
				var _module;
				for(i in _layouts) {
					if((_screenSize.height >= _layouts[i].height) && (_screenSize.width >= _layouts[i].width)) {
						return _layouts[i];
					}
				}

				// No layouts fit
				// TODO: what do we do here?
				// TODO: for now we're just returning the smallest.
				return _layouts[_layouts.length-1];
			},
			/**
			 * Sets the current layout used by the application.
			 * @param {Object} layout An application-specific object literal describing layout-specific properties
			 * @param {String} styleBaseUrl Base URL of stylesheets for the application.
			 * @param {String} imageBaseUrl Base URL of images for the application.
			 * @param {Array} [additionalCSS] Additional stylesheet URLs to load.
			 * @param {Array} [additionalClasses] Additional classes to add to the document element.
			 * @param {Array} [additionalPreloadImages] Additional images to preload.
			 * @param {function()} [callback] Callback function to call when layout has been fully loaded.
			 */
			setLayout: function(layout, styleBaseUrl, imageBaseUrl, additionalCSS, additionalClasses, additionalPreloadImages, callback) {
			    var i;
				this._layout = layout;
				var tle = this._device.getTopLevelElement();
                
				var classes = layout.classes || [];
				if(additionalClasses) {
					classes = classes.concat(additionalClasses);
				}
				for(i = 0; i !== classes.length; i += 1) {
					this._device.addClassToElement(tle, classes[i]);
				}

				var preloadImages = layout.preloadImages || [];
				if(additionalPreloadImages) {
					preloadImages = preloadImages.concat(additionalPreloadImages);
				}
				for(i = 0; i !== preloadImages.length; i += 1) {
					this._device.preloadImage(imageBaseUrl + preloadImages[i]);
				}

				var css = layout.css || [];
				if(additionalCSS) {
					css = css.concat(additionalCSS);
				}
				if(callback) {
					var currentlyLoadingIndex = -1;
					var self = this;
					function cssLoadedCallback() {
						if(++currentlyLoadingIndex < css.length) {
							self._device.loadStyleSheet(styleBaseUrl + css[currentlyLoadingIndex], cssLoadedCallback);
						} else {
							callback();
						}
					}
					cssLoadedCallback();
				} else {
					console.log('no callback');
					for(i = 0; i !== css.length; i += 1) {
						this._device.loadStyleSheet(styleBaseUrl + css[i]);
					}
				}
			},
			/**
			 * Gets the current layout as set by {@see #setLayout}.
			 * @returns An application-specific object literal describing layout-specific properties.
			 */
			getLayout: function() {
				return this._layout;
			},
			/**
			 * Set the root widget of the application.
			 * @param {antie.widgets.Widget} widget The new root widget.
			 */
			setRootWidget: function(widget) {
				widget.addClass('rootwidget');
				if(widget instanceof List) {
					widget.setRenderMode(List.RENDER_MODE_CONTAINER);
				}
				this._rootWidget = widget;
				this._rootWidget._isFocussed = true;
				if(this._rootWidget.outputElement == null) {
					var device = this.getDevice();
					device.appendChildElement(this._rootElement, widget.render(device));
				}
				var self = this;
				if(self._onReadyHandler) {
					this._rootWidget.addEventListener('applicationready', function(e) {
						self._onReadyHandler(e);
					});
				}
			},
			/**
			 * Get the root widget of the application.
			 * @return The root widget of the application.
			 */
			getRootWidget: function() {
				return this._rootWidget;
			},
			/**
			 * Add a component container to the application.
			 * @param {String} id The ID of the new component container.
			 * @param {String} [modules] The requirejs module name of the component to pre-load.
			 * @param {Object} [args] An optional object to pass arguments into any pre-loaded component.
			 */
			addComponentContainer: function(id, module, args) {
				var container = new ComponentContainer(id);
				this._rootWidget.appendChildWidget(container);

				if(module) {
					this.showComponent(id, module, args);
				}

				return container;
			},
			/**
			 * Show a component in a component container. This resets any history for the container.
			 * @see #pushComponent
			 * @param {String} id The ID of the container into which to show the component.
			 * @param {String} modules The requirejs module name of the component to show.
			 * @param {Object} [args] An optional object to pass arguments to the component.
			 */
			showComponent: function(id, module, args) {
				this._rootWidget.getChildWidget(id).show(module, args);
			},
			/**
			 * Pushes a component into the history stack of a container (and shows it).
			 * @param {String} id The ID of the container into which to show the component.
			 * @param {String} modules The requirejs module name of the component to show.
			 * @param {Object} [args] An optional object to pass arguments to the component.
			 */
			pushComponent: function(id, module, args) {
				this._rootWidget.getChildWidget(id).pushComponent(module, args);
			},
			/**
			 * Pops a component from the history stack of a container (if a previous component exists)
			 * @param {String} id The ID of the container that contains the component to pop.
			 */
			popComponent: function(id) {
				this._rootWidget.getChildWidget(id).back();
			},
			/**
			 * Hides a component.
			 * @param {String} id The ID of the container that contains the component to hide.
			 */
			hideComponent: function(id) {
				this._rootWidget.getChildWidget(id).hide();
			},
			/**
			 * Gets a component by ID.
			 * @param {String} id The ID of the container to return.
			 */
			getComponent: function(id) {
				return this._rootWidget.getChildWidget(id);
			},
			/**
			 * Sets the active focus to the specified component.
			 * @param {String} id The ID of the container that contains the component to set focus on.
			 */
			setActiveComponent: function(id) {
				return this._rootWidget.setActiveChildWidget(this._rootWidget.getChildWidget(id));
			},
			/**
			 * Returns the Device object currently running this application.
			 * @returns The antie.devices.Device object currently running this application.
			 */
			getDevice: function() {
				return this._device;
			},
			/**
			 * Bubbles an event from the currently focussed widget up through the widget tree.
			 * @param {antie.events.Event} evt The event to bubble.
			 */
			bubbleEvent: function(evt) {
				if(this._focussedWidget) {
					this._focussedWidget.bubbleEvent(evt);
				}
			},

			/**
			 * Broadcasts an event from the application level to every single
			 * object it contains.
			 * @param {antie.events.Event} evt The event to broadcast.
			 */
			broadcastEvent: function(evt) {
				if (evt.sentDown) { return; }
				evt.sentDown = 1;
				this._rootWidget.broadcastEvent(evt);
			},
			/**
			 * Returns the currently-focussed Button.
			 * @returns The antie.widgets.Button which currently has focus.
			 */
			getFocussedWidget: function() {
				return this._focussedWidget;
			},
			/**
			 * Set the currently focussed Button.
			 * @param {antie.widgets.Button} widget The antie.widgets.Button that has recieved focus.
			 * @private
			 */
			_setFocussedWidget: function(widget) {
				// Check to see the widget is a Button and itself has correct focus state before recording
				// it as the focussed widget.
				if((widget instanceof Button) && widget.isFocussed()) {
					this._focussedWidget = widget;
				}
			},
			/**
			 * Adds an event listener to the root widget. This is the last point of call for events bubbled
			 * up through the UI.
			 * @param {String} evt The event to handle.
			 * @param {function(Event)} handler The handler function to call when the event hits the root widget.
			 */
			addEventListener: function(evt, handler) {
				this._rootWidget.addEventListener(evt, handler);
			},
			/**
			 * Removes an event listener from the root widget.
			 * @param {String} evt The event to handle.
			 * @param {function(Event)} handler The handler function to remove.
			 */
			removeEventListener: function(evt, handler) {
				this._rootWidget.removeEventListener(evt, handler);
			},
			/**
			 * Gets the current route (a reference pointing to a location within the application).
			 * @returns The current route (location within the application).
			 */
			getCurrentRoute: function() {
				return this._device.getCurrentRoute();
			},
			/**
			 * Sets the current route (a reference pointing to a location within the application).
			 * @param {Array} route A route pointing to a location within the application.
			 */
			setCurrentRoute: function(route) {
				this._referer = this._device.getCurrentRoute();
				this._device.setCurrentRoute(route);
			},
			/**
			 * Gets the reference (e.g. URL) of the resource that launched the application or
			 * the previous location within the application.
			 * @returns A reference (e.g. URL) of the previous location.
			 */
			getReferer: function () {
				return this._referer || this._device.getReferrer();
			},
			/**
			 * Called after {@link #run} to launch the application at a specific location.
			 * @param {Array} route Location of application.
			 */
			route: function(route) {
				// intentionally left blank
			},
			/**
			 * Destroys the application, allowing you to run another. This is mainly for use when building
			 * unit or BDD tests.
			 */
			destroy: function () {
				applicationObject = undefined;
				ComponentContainer.destroy();
			}
		});

		/**
		 * Returns the currently executing application.
		 * @name getCurrentApplication
		 * @memberOf antie.Application
		 * @static
		 * @function
		 */
		Application.getCurrentApplication = function() {
			return applicationObject;
		};

		return Application;
	}
);
