/**
 * @fileOverview Requirejs module containing the antie.widgets.Button class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/button',
    [
        'antie/widgets/container',
        'antie/events/focusdelayevent',
        'antie/events/keyevent',
        'antie/events/selectevent'
    ],
    function(Container, FocusDelayEvent, KeyEvent, SelectEvent) {
        'use strict';

        /**
         * The Button widget class represents a container widget which can receive focus and be selected/activated by the user.
         * @name antie.widgets.Button
         * @class
         * @extends antie.widgets.Container
         * @requires antie.events.FocusDelayEvent
         * @requires antie.events.KeyEvent
         * @requires antie.events.SelectEvent
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         * @param {boolean} [animationEnabled] If true, a focus delay will be set before displaying the button
         */
        return Container.extend(/** @lends antie.widgets.Button.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (id, animationEnabled) {
                //TODO refactor this to set focusDelay explicitly rather than using animationEnabled with fixed focusDelay
                init.base.call(this, id);
                this.addClass('button');
                this.addClass('buttonBlurred');

                this._focusDelayHandle = null;
                this._disabled = false;

                /* Reduce the focusDelayTimeout for devices that don't have animation enabled */
                if(typeof animationEnabled === 'boolean' && !animationEnabled) {
                    this._focusDelayTimeout = 500;
                } else {
                    this._focusDelayTimeout = 1500;
                }

                /* if the ENTER key is pressed, translate into into a SelectEvent on this button */
                var self = this;
                this.addEventListener('keydown', function(e) {
                    if(e.keyCode === KeyEvent.VK_ENTER) {
                        self.select();
                        e.stopPropagation();
                    }
                });
            },
            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function render (device) {
                this.outputElement = device.createButton(this.id, this.getClasses(), '#');
                for(var i=0; i<this._childWidgetOrder.length; i++) {
                    device.appendChildElement(this.outputElement, this._childWidgetOrder[i].render(device));
                }
                return this.outputElement;
            },
            /**
             * Checks to see if a widget is focusable.
             * @see antie.widgets.Button
             * @returns {Boolean} True if the button is enabled.
             */
            isFocusable: function isFocusable () {
                // a widget can receive focus if it or any of it's descendants are Buttons
                // We're a button, so we are
                return !this._disabled;
            },
            /**
             * Set the button to be disabled and therefore not focusable. Adds buttonDisabled class.
             * @param {Boolean} disabled True if the button is to be disabled.
             */
            setDisabled: function setDisabled (disabled) {
                this._disabled = disabled;
                if(disabled) {
                    this.addClass('buttonDisabled');
                } else {
                    this.removeClass('buttonDisabled');
                }
            },
            /**
             * Gives this button focus by setting active children back up the widget tree.
             * @see antie.widgets.Button
             * @param {Boolean} [force] Pass <code>true</code> to force focus to a disabled button.
             * @returns Boolean true if focus has been moved to the button. Otherwise returns false.
             */
            focus: function focus (force) {
                var origDisabled = this._disabled;
                if(force) {
                    this._disabled = false;
                }

                var focusChanged = true;
                var w = this;
                while(w.parentWidget) {
                    if(!w.parentWidget.setActiveChildWidget(w)) {
                        focusChanged = false;
                    }
                    w = w.parentWidget;
                }

                this._disabled = origDisabled;

                return focusChanged;
            },
            select: function select () {
                this.bubbleEvent(new SelectEvent(this));
            },
            /**
             * Flags the active child as focussed or blurred.
             * @param {Boolean} focus True if the active child is to be focussed, False if the active child is to be blurred.
             * @private
             */
            _setActiveChildFocussed: function _setActiveChildFocussed (focus) {
                if(this._focusDelayHandle) {
                    clearTimeout(this._focusDelayHandle);
                }
                if(focus) {
                    this.removeClass('buttonBlurred');
                    this.addClass('buttonFocussed');

                    var self = this;
                    // Fire a focus delay event if this button has had focus for more than x-seconds.
                    this._focusDelayHandle = setTimeout(function() {
                        self.bubbleEvent(new FocusDelayEvent(self));
                    }, this._focusDelayTimeout);

                    this.getCurrentApplication()._setFocussedWidget(this);
                } else {
                    this.removeClass('buttonFocussed');
                    this.addClass('buttonBlurred');
                }
            },
            removeFocus: function removeFocus () {
                removeFocus.base.call(this);
                this.removeClass('buttonFocussed');
                this.addClass('buttonBlurred');
            }
        });
    }
);
