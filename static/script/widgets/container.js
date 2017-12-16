/**
 * @fileOverview Requirejs module containing the antie.widgets.Container abstract class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/container',
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
            init: function init (id) {
                /*
                 * Performance consideration - do we need to store 2 references to each child widget?
                 * One keyed by ID, one in an array to maintain order?
                 */
                this._childWidgets = {};
                this._childWidgetOrder = [];
                this._activeChildWidget = null;
                this._autoRenderChildren = true;

                init.base.call(this, id);

                this.addClass('container');
            },
            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function render (device) {
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
            appendChildWidget: function appendChildWidget (widget) {
                if(!this.hasChildWidget(widget.id)) {
                    this._childWidgets[widget.id] = widget;
                    this._childWidgetOrder.push(widget);
                    widget.parentWidget = this;

                    // If there's no active child widget set, try and set it to this
                    // (Will only have an affect if it's focusable (i.e. contains a button))
                    if(!this._activeChildWidget) {
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
            prependWidget: function prependWidget (widget) {
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
            insertChildWidget: function insertChildWidget (index, widget) {
                if(!this.hasChildWidget(widget.id)) {
                    if(index >= this._childWidgetOrder.length) {
                        return this.appendChildWidget(widget);
                    }

                    this._childWidgets[widget.id] = widget;
                    this._childWidgetOrder.splice(index, 0, widget);
                    widget.parentWidget = this;

                    // If there's no active child widget set, try and set it to this
                    // (Will only have an affect if it's focusable (i.e. contains a button))
                    if(!this._activeChildWidget) {
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
            removeChildWidgets: function removeChildWidgets () {
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
            removeChildWidget: function removeChildWidget (widget, retainElement) {
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
            hasChildWidget: function hasChildWidget (id) {
                return !!this._childWidgets[id];
            },
            /**
             * Get a child widget from its unique ID.
             * @param {String} id The id of the child widget to return.
             * @returns antie.widgets.Widget of the widget with the given ID, otherwise undefined if the child does not exist.
             */
            getChildWidget: function getChildWidget (id) {
                return this._childWidgets[id];
            },
            /**
             * Get an array of all this widget's children.
             * @returns An array of all this widget's children.
             */
            getChildWidgets: function getChildWidgets () {
                return this._childWidgetOrder;
            },
            getIndexOfChildWidget: function getIndexOfChildWidget (widget) {
                return this._childWidgetOrder.indexOf(widget);
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
            setActiveChildWidget: function setActiveChildWidget (widget) {
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

                    if(!this.getCurrentApplication().getFocussedWidget()) {
                        var widgetIterator = this;
                        while(widgetIterator.parentWidget) {
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
            setActiveChildIndex: function setActiveChildIndex (index) {
                if(index < 0 || index >= this._childWidgetOrder.length) {
                    throw new Error('Widget::setActiveChildIndex Index out of bounds. ' + this.id + ' contains ' + this._childWidgetOrder.length + ' children, but an index of ' + index + ' was specified.');
                }
                return this.setActiveChildWidget(this._childWidgetOrder[index]);
            },
            /**
             * Get the current active widget.
             * @returns The current active widget
             */
            getActiveChildWidget: function getActiveChildWidget () {
                return this._activeChildWidget;
            },
            /**
             * Flags the active child as focussed or blurred.
             * @param {Boolean} focus True if the active child is to be focussed, False if the active child is to be blurred.
             * @private
             */
            _setActiveChildFocussed: function _setActiveChildFocussed (focus) {
                if(this._activeChildWidget && (this._activeChildWidget._isFocussed !== focus)) {
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
            getChildWidgetCount: function getChildWidgetCount () {
                return this._childWidgetOrder.length;
            },
            /**
             * Checks to see if a widget is focussable, i.e. contains an enabled button.
             * @see antie.widgets.Button
             */
            isFocusable: function isFocusable () {
                for(var i=0; i<this._childWidgetOrder.length; i++) {
                    if(this._childWidgetOrder[i].isFocusable()) {
                        if(!this._activeChildWidget) {
                            //this._activeChildWidget = this._childWidgetOrder[i];
                            this.setActiveChildWidget(this._childWidgetOrder[i]);
                        }
                        return true;
                    }
                }
                return false;
            },
            setAutoRenderChildren: function setAutoRenderChildren (autoRenderChildren) {
                this._autoRenderChildren = autoRenderChildren;
            },

            /**
             * Broadcasts an event from the application level to every single
             * object it contains.
             */
            broadcastEvent: function broadcastEvent (evt) {
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
            focus: function focus () {
                if(this._activeChildWidget) {
                    return this._activeChildWidget.focus();
                }
                return false;
            }
        });
        return Container;
    }
);
