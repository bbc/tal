/**
 * @fileOverview Requirejs module containing the antie.widgets.ComponentContainer class.
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

require.def('antie/widgets/componentcontainer',
    [
        'antie/widgets/container',
        'antie/events/componentevent'
    ],
    function (Container, ComponentEvent) {
        'use strict';

        var _knownComponents = {};
        /**
         * The ComponentContainer widget class represents a container that Components (sections of UI) may be dynamically loaded into.
         * @name antie.widgets.ComponentContainer
         * @class
         * @extends antie.widgets.Container
         * @requires antie.events.ComponentEvent
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         */
        var ComponentContainer = Container.extend(/** @lends antie.widgets.ComponentContainer.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function (id) {
                this._loadingIndex = 0;
                this._loadingModule = null;
                this._currentModule = null;
                this._currentComponent = null;
                this._currentArgs = null;
                this._historyStack = [];
                this._previousFocus = null;
                this._super(id);
                this.addClass('componentcontainer');
            },
            /**
             * Callback called when a requirejs containing a component has been loaded.
             * @private
             * @param {String} module The requirejs module name of the loaded component.
             * @param {Class} componentClass The subclass of antie.widgets.Component which has been loaded.
             * @param {Object} [args] The arguments passed to populate the component.
             */
            _loadComponentCallback: function (module, componentClass, args, keepHistory, state) {
                if (this.getCurrentApplication() == null) {
                    // Application has been destroyed, abort
                    return;
                }

                var newComponent = new componentClass();

                // Add the component to our table of known components.
                _knownComponents[module] = newComponent;

                // set the parent widget so the next event bubbles correctly through the tree
                newComponent.parentWidget = this;
                newComponent.bubbleEvent(new ComponentEvent('load', this, _knownComponents[module], args));
                // clear the parent widget again
                newComponent.parentWidget = null;

                // Show the component.
                this.show(module, args, keepHistory, state);
            },
            /**
             * Show a component within this container. If the specified component has not been loaded, load it.
             * @param {String} module The requirejs module name of the component to show.
             * @param {Object} [args] The arguments to populate the component.
             * @param {Boolean} [keepHistory] If true, the current component shown in this container is preserved in the history stack.
             * @param {Object} [state] Additional component-specific state information
             */
            show: function (module, args, keepHistory, state, fromBack, focus) {
                this._loadingModule = module;

                this._loadingIndex++;
                var loadingIndex = this._loadingIndex;

                var self;
                if (_knownComponents[module]) {
                    var device = this.getCurrentApplication().getDevice();

                    var _focus = this.getCurrentApplication().getFocussedWidget();
                    if (this._currentComponent) {
                        this.hide(null, args, keepHistory, state, fromBack);
                    }

                    this._currentModule = module;
                    this._currentComponent = _knownComponents[module];
                    this._currentArgs = args;
                    if (!fromBack) {
                        this._previousFocus = _focus;
                    }

                    if (!this._isFocussed) {
                        // We don't have focus, so any of our children shouldn't
                        // (_isFocussed state can be set to true if focussed widget is in a unloaded component)
                        var p = this._currentComponent;
                        while (p) {
                            p.removeFocus();
                            p = p._activeChildWidget;
                        }
                    }

                    // set the parent widget so the next event bubbles correctly through the tree
                    this._currentComponent.parentWidget = this;

                    this._currentComponent.bubbleEvent(new ComponentEvent('beforerender', this, this._currentComponent, args, state, fromBack));

                    this._currentComponent.render(device);

                    // and clear it again
                    this._currentComponent.parentWidget = null;

                    device.hideElement({
                        el: this._currentComponent.outputElement,
                        skipAnim: true
                    });

                    this.appendChildWidget(this._currentComponent);

                    var evt = new ComponentEvent('beforeshow', this, this._currentComponent, args, state, fromBack);
                    this._currentComponent.bubbleEvent(evt);

                    if (focus) {
                        focus.focus();
                    }

                    self = this;
                    if (!evt.isDefaultPrevented()) {
                        var config = device.getConfig();
                        var animate = !config.widgets || !config.widgets.componentcontainer || (config.widgets.componentcontainer.fade !== false);
                        device.showElement({
                            el: this._currentComponent.outputElement,
                            skipAnim: !animate
                        });
                    }

                    self._currentComponent.bubbleEvent(new ComponentEvent('aftershow', self, self._currentComponent, args, state, fromBack));

                    var focusRemoved = self.setActiveChildWidget(self._currentComponent);
                    if (focusRemoved == false) {
                        self._activeChildWidget = self._currentComponent;
                        self.getCurrentApplication().getDevice().getLogger().warn('active component is not currently focusable', self._activeChildWidget);
                    }
                } else {
                    // hook into requirejs to load the component from the module and call us again
                    self = this;
                    require([module], function (componentClass) {
                        // Check we've not navigated elsewhere whilst requirejs has been loading the module
                        if (self._loadingModule === module && self._loadingIndex === loadingIndex) {
                            self._loadComponentCallback(module, componentClass, args, keepHistory, state, fromBack, focus);
                        }
                    });
                }
            },
            /**
             * Pushes a component into the history stack of the container (and shows it).
             * @param {String} module The requirejs module name of the component to show.
             * @param {Object} [args] An optional object to pass arguments to the component.
             */
            pushComponent: function (module, args) {
                this.show(module, args, true);
            },
            /**
             * Returns the widget added to this container.
             */
            getContent: function () {
                return this._currentComponent;
            },
            /**
             * Return this component container to the previous component in the history.
             */
            back: function () {
                var _focus = this._currentComponent.getIsModal() ? this._previousFocus : null;

                var _lastComponent = this._historyStack.pop();
                if (_lastComponent) {
                    this._previousFocus = _lastComponent.previousFocus;
                    this.show(_lastComponent.module, _lastComponent.args, true, _lastComponent.state, true, _focus);
                } else {
                    this.hide(null, null, false, null, false);
                }
            },
            /**
             * Hide the component within this container.
             */
            hide: function (focusToComponent, args, keepHistory, state, fromBack) {
                var self = this;

                if (this._currentComponent) {
                    var evt = new ComponentEvent('beforehide', this, this._currentComponent, args, state, fromBack);
                    this._currentComponent.bubbleEvent(evt);

                    var _state = keepHistory ? this._currentComponent.getCurrentState() : null;

                    // remove the child widget, but if default event is prevented, keep the output element in the DOM
                    this.removeChildWidget(this._currentComponent, evt.isDefaultPrevented());

                    var _component = this._currentComponent;
                    this._currentComponent = null;

                    // set the parent widget so the next event bubbles correctly through the tree
                    _component.parentWidget = this;
                    _component.bubbleEvent(new ComponentEvent('afterhide', this, _component, args, state, fromBack));
                    // and clear it again
                    _component.parentWidget = null;

                    if (keepHistory) {
                        if (!fromBack) {
                            this._historyStack.push({
                                module: this._currentModule,
                                args: this._currentArgs,
                                state: _state,
                                previousFocus: this._previousFocus
                            });
                        }
                    } else {
                        // Reset the history stack when a component is shown in this container without explicitly
                        // enabling history.
                        if (_component.getIsModal() && !fromBack) {
                            if (this._historyStack.length > 0) {
                                this._historyStack[0].previousFocus.focus();
                            } else if (this._previousFocus) {
                                this._previousFocus.focus();
                            }
                        }
                        this._historyStack = [];
                    }
                }
                if (this._isFocussed && focusToComponent) {
                    this.parentWidget.setActiveChildWidget(this.parentWidget._childWidgets[focusToComponent]);
                }
            },
            getCurrentModule: function () {
                return this._currentModule;
            },
            getCurrentArguments: function () {
                return this._currentArgs;
            }
        });
        ComponentContainer.destroy = function () {
            for (var module in _knownComponents) {
                delete _knownComponents[module];
            }
        };
        return ComponentContainer;
    }
);
