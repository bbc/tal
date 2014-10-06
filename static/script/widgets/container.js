/**
 * @fileOverview Requirejs module containing the antie.widgets.Container abstract class.
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

require.def('antie/widgets/container',
	[
        'antie/widgets/widget',
        'antie/events/focusevent',
        'antie/events/blurevent'
	],
	function(Widget, FocusEvent, BlurEvent) {
		'use strict';

		/**
		 * The abstract Container widget class represents any Widget that may contain children widgets.
		 * @name antie.widgets.Container
		 * @class
		 * @abstract
		 * @extends antie.widgets.Widget
		 * @requires antie.events.FocusEvent
		 * @requires antie.events.BlurEvent
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 */
		var Container;
		Container = Widget.extend(/** @lends antie.widgets.Container.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id) {
				/*
                * Performance consideration - do we need to store 2 references to each child widget? 
                * One keyed by ID, one in an array to maintain order?
                */
				this._childWidgets = {};
				this._childWidgetOrder = [];
				this._activeChildWidget = null;
				this._autoRenderChildren = true;

				this._super(id);

				this.addClass('container');
			},
			/**
			 * Renders the widget and any child widgets to device-specific output.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
			    var i;
				if(!this.outputElement) {
					this.outputElement = device.createContainer(this.id, this.getClasses());
				} else {
					device.clearElement(this.outputElement);
				}
				for(i=0; i<this._childWidgetOrder.length; i++) {
					device.appendChildElement(this.outputElement, this._childWidgetOrder[i].render(device));
				}
				return this.outputElement;
			},
			/**
			 * Appends a child widget to this widget.
			 * @param {antie.widgets.Widget} widget The child widget to add.
			 */
			appendChildWidget: function(widget) {
				if(!this.hasChildWidget(widget.id)) {
					this._childWidgets[widget.id] = widget;
					this._childWidgetOrder.push(widget);
					widget.parentWidget = this;

					// If there's no active child widget set, try and set it to this
					// (Will only have an affect if it's focusable (i.e. contains a button))
					if(this._activeChildWidget == null) {
						this.setActiveChildWidget(widget);
					}

					if(this.outputElement && this._autoRenderChildren) {
						var device = this.getCurrentApplication().getDevice();
						device.appendChildElement(this.outputElement,  widget.render(device));
					}

					return widget;
				}
			},

			/**
			 * Inserts a widget before the current one.
			 * @param {antie.widgets.Widget} widget The child widget to
			 * add.
			 */
			prependWidget: function(widget) {
				// Find the current widget's order.
                if(this.parentWidget instanceof Container) {
                    var widgetOrder, insertionIndex;
                    widgetOrder = this.parentWidget._childWidgetOrder;
                    
                    for (insertionIndex = 0; insertionIndex !== widgetOrder.length; insertionIndex +=1) {
                    if (widgetOrder[insertionIndex] === this) {
                        break;
                        }
                    }
                
                    // Insert the new widget in the current one's position.
                    this.parentWidget.insertChildWidget(insertionIndex, widget);
                }
				return widget;
			},
			/**
			 * Inserts a child widget at the specified index.
			 * @param {Integer} index The index where to insert the child widget.
			 * @param {antie.widgets.Widget} widget The child widget to add.
			 */
			insertChildWidget: function(index, widget) {
				if(!this.hasChildWidget(widget.id)) {
					if(index >= this._childWidgetOrder.length) {
						return this.appendChildWidget(widget);
					}

					this._childWidgets[widget.id] = widget;
					this._childWidgetOrder.splice(index, 0, widget);
					widget.parentWidget = this;

					// If there's no active child widget set, try and set it to this
					// (Will only have an affect if it's focusable (i.e. contains a button))
					if(this._activeChildWidget == null) {
						this.setActiveChildWidget(widget);
					}

					if(this.outputElement && this._autoRenderChildren) {
						var device = this.getCurrentApplication().getDevice();

						if(!widget.outputElement) {
							widget.render(device);
						}

						device.insertChildElementBefore(this.outputElement, widget.outputElement, this._childWidgetOrder[index+1].outputElement);
					}

					return widget;
				}
			},
			/**
			 * Remove all child widgets from this widget.
			 */
			removeChildWidgets: function() {
				if(this._isFocussed && this._activeChildWidget) {
					var logger = this.getCurrentApplication().getDevice().getLogger();
					logger.warn('Removing widget that currently has focus: ' + this._activeChildWidget.id);
				}

				if(this.outputElement) {
					var device = this.getCurrentApplication().getDevice();
					device.clearElement(this.outputElement);
				}
				for(var i=0; i<this._childWidgetOrder.length; i++) {
					this._childWidgetOrder[i].parentWidget = null;
				}

				this._childWidgets = {};
				this._childWidgetOrder = [];
				this._activeChildWidget = null;
			},
			/**
			 * Removes a specific child widget from this widget.
			 * @param {antie.widgets.Widget} widget The child widget to remove.
			 * @param {Boolean} [retainElement] Pass <code>true</code> to retain the child output element of the given widget
			 */
			removeChildWidget: function(widget, retainElement) {
				if(!widget) {
					return;
				}
				
				var widget_index = this.getIndexOfChildWidget(widget);
				if (widget_index < 0) {
					return;
				}

				if(widget._isFocussed) {
					var logger = this.getCurrentApplication().getDevice().getLogger();
					logger.warn('Removing widget that currently has focus: ' + widget.id);
				}

				if(!retainElement && widget.outputElement) {
					var device = this.getCurrentApplication().getDevice();
					device.removeElement(widget.outputElement);
				}

				this._childWidgetOrder.splice(widget_index, 1);
				delete(this._childWidgets[widget.id]);
				
				widget.parentWidget = null;

			},
			/**
			 * Checks to see if a specific widget is a direct child of this widget.
			 * @param {String} id The widget id of the widget to check to see if it is a direct child of this widget.
			 */
			hasChildWidget: function(id) {
				return this._childWidgets[id] != null;
			},
			/**
			 * Get a child widget from its unique ID.
			 * @param {String} id The id of the child widget to return.
			 * @returns antie.widgets.Widget of the widget with the given ID, otherwise undefined if the child does not exist.
			 */
			getChildWidget: function(id) {
				return this._childWidgets[id];
			},
			/**
			 * Get an array of all this widget's children.
			 * @returns An array of all this widget's children.
			 */
			getChildWidgets: function() {
				return this._childWidgetOrder;
			},
			getIndexOfChildWidget: function(widget) {
				var device = this.getCurrentApplication().getDevice();
				return device.arrayIndexOf(this._childWidgetOrder, widget);
			},
			/**
			 * Attempt to set focus to the given child widget.
			 *
			 * Note: You can only set focus to a focusable widget. A focusable widget is one that
			 * contains an enabled antie.widgets.Button as either a direct or indirect child.
			 *
			 * Note: Widgets have 2 independent states: active and focussed. A focussed widget is
			 * either the Button with focus, or any parent of that Button. An active widget is
			 * one which is the active child of its parent Container. When the parent widget
			 * receives focus, focus will be placed on the active child.
			 *
			 * Classes 'active' and 'focus' are appended to widgets with these states.
			 * 
			 * @param {antie.widgets.Widget} widget The child widget to set focus to.
			 * @returns Boolean true if the child widget was focusable, otherwise boolean false.
			 */
			setActiveChildWidget: function(widget) {
				if (!widget) {
					return false;
				}
				if(this.hasChildWidget(widget.id) && widget.isFocusable()) {
					if(this._activeChildWidget && this._activeChildWidget !== widget) {
						this._activeChildWidget.removeClass('active');
						this._setActiveChildFocussed(false);
					}
					widget.addClass('active');
					this._activeChildWidget = widget;

					if(this.getCurrentApplication().getFocussedWidget() == null) {
						var widgetIterator = this;
						while(widgetIterator.parentWidget != null) {
							widgetIterator.parentWidget._activeChildWidget = widgetIterator;
							widgetIterator._isFocussed = true;

							widgetIterator = widgetIterator.parentWidget;
						}
					}
					if(this._isFocussed) {
						this._setActiveChildFocussed(true);
					}
					return true;
				}
				return false;
			},
			/**
			 * Attempts to set focus to the child widget at the given index.
			 * @see #setActiveChildWidget
			 * @param {Integer} index Index of the child widget to set focus to.
			 * @returns Boolean true if the child widget was focusable, otherwise boolean false.
			 */
			setActiveChildIndex: function(index) {
				if(index < 0 || index >= this._childWidgetOrder.length) {
					throw new Error("Widget::setActiveChildIndex Index out of bounds. " + this.id + " contains " + this._childWidgetOrder.length + " children, but an index of " + index + " was specified.");
				}
				return this.setActiveChildWidget(this._childWidgetOrder[index]);
			},
			/**
			 * Get the current active widget.
			 * @returns The current active widget
			 */
			getActiveChildWidget: function() {
				return this._activeChildWidget; 
			},
			/**
			 * Flags the active child as focussed or blurred.
			 * @param {Boolean} focus True if the active child is to be focussed, False if the active child is to be blurred.
			 * @private
			 */
			_setActiveChildFocussed: function(focus) {
				if(this._activeChildWidget && (this._activeChildWidget._isFocussed != focus)) {
					this._activeChildWidget._isFocussed = focus;
					if(focus) {
						this._activeChildWidget.addClass('focus');
						this._activeChildWidget.bubbleEvent(new FocusEvent(this._activeChildWidget));
						// TODO: force focus to change in the application (rather than relying on the above
						// TODO: even to propagate to the application level
					} else {
						this._activeChildWidget.removeClass('focus');
						this._activeChildWidget.bubbleEvent(new BlurEvent(this._activeChildWidget));
					}
					this._activeChildWidget._setActiveChildFocussed(focus);
				}
			},
			/**
			 * Gets the number of direct child widgets.
			 * @returns The number of direct child widgets.
			 */
			getChildWidgetCount: function() {
				return this._childWidgetOrder.length;
			},
			/**
			 * Checks to see if a widget is focussable, i.e. contains an enabled button.
			 * @see antie.widgets.Button
			 */
			isFocusable: function() {
				for(var i=0; i<this._childWidgetOrder.length; i++) {
					if(this._childWidgetOrder[i].isFocusable()) {
						if(this._activeChildWidget == null) {
							//this._activeChildWidget = this._childWidgetOrder[i];
							this.setActiveChildWidget(this._childWidgetOrder[i]);
						}
						return true;
					}
				}
				return false;
			},
			setAutoRenderChildren: function(autoRenderChildren) {
				this._autoRenderChildren = autoRenderChildren;
			},

			/**
			 * Broadcasts an event from the application level to every single
			 * object it contains.
			 */
			broadcastEvent: function(evt) {
				this.fireEvent(evt);
				if(!evt.isPropagationStopped()) {
					for(var i=0; i<this._childWidgetOrder.length; i++) {
						this._childWidgetOrder[i].broadcastEvent(evt);
					}
				}
			},
			/**
			 * Moves focus to a button within this container. Focused button will be that which follows
			 * the current 'active' path.
			 * @returns Boolean true if focus has been moved to a button. Otherwise returns false.
			 */
			focus: function() {
				if(this._activeChildWidget) {
					return this._activeChildWidget.focus();
				}
				return false;
			}
		});
		return Container;
	}
);
