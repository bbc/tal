/**
 * @fileOverview Requirejs module containing the antie.widgets.Grid class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/grid',
    [
        'antie/widgets/container',
        'antie/events/keyevent',
        'antie/events/selecteditemchangeevent'
    ],
    function (Container, KeyEvent, SelectedItemChangeEvent) {
        'use strict';

        /**
         * The Grid widget class represents a grid of widgets that may be navigated between using up/down/left/right.
         * @name antie.widgets.Grid
         * @class
         * @extends antie.widgets.Container
         * @requires antie.events.KeyEvent
         * @requires antie.events.SelectedItemChangeEvent
         * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
         * @param {Integer} cols The number of columns in the grid.
         * @param {Integer} rows The number of rows in the grid.
         * @param {boolean} horizontalWrapping Enable or disable horizontal wrapping.
         * @param {boolean} verticalWrapping Enable or disable vertical wrapping.
         */
        var Grid = Container.extend(/** @lends antie.widgets.Grid.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (id, cols, rows, horizontalWrapping, verticalWrapping) {
                init.base.call(this, id);
                this.addClass('grid');

                this._cols = cols;
                this._rows = rows;

                this._horizontalWrapping =  !!horizontalWrapping;
                this._verticalWrapping = !!verticalWrapping;

                this._selectedRow = 0;
                this._selectedCol = 0;

                for (var i = 0; i < cols * rows; i++) {
                    this._childWidgetOrder.push(null);
                }

                var self = this;
                this.addEventListener('keydown', function (e) {
                    self._onKeyDown(e);
                });
            },
            /**
             * Get the widget positioned at the specified column and row.
             * @param {Integer} col The column the widget it in
             * @param {Integer} row The row the widget it in
             * @returns The widget in the specified column and row
             */
            getWidgetAt: function getWidgetAt (col, row) {
                return this._childWidgetOrder[(this._cols * row) + col];
            },
            /**
             * Positions a widget at the specified column and row.
             * @param {Integer} col The column to position the widget in
             * @param {Integer} row The row to position the widget in
             * @param {antie.widgets.Widget} widget The widget to add
             */
            setWidgetAt: function setWidgetAt (col, row, widget) {
                if (!this.hasChildWidget(widget.id)) {
                    this._childWidgets[widget.id] = widget;
                    this._childWidgetOrder[(this._cols * row) + col] = widget;
                    widget.parentWidget = this;

                    // If there's no active child widget set, try and set it to this
                    // (Will only have an affect if it's focusable (i.e. contains a button))
                    if (!this._activeChildWidget) {
                        this.setActiveChildWidget(widget);
                    }

                    if (this.outputElement && this._autoRenderChildren) {
                        var device = this.getCurrentApplication().getDevice();

                        if (!widget.outputElement) {
                            widget.render(device);
                        }

                        device.appendChildElement(this.outputElement, widget.outputElement);
                    }
                }
            },
            /**
             * Renders the widget and any child widgets to device-specific output.
             * @param {antie.devices.Device} device The device to render to.
             * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
             */
            render: function render (device) {
                if (!this.outputElement) {
                    this.outputElement = device.createContainer(this.id, this.getClasses());
                } else {
                    device.clearElement(this.outputElement);
                }

                var rowElement;
                for (var row = 0; row < this._rows; row++) {
                    rowElement = device.createContainer(this.id + '_row_' + row, ['row']);
                    for (var col = 0; col < this._cols; col++) {
                        var widget = this.getWidgetAt(col, row);
                        if (widget) {
                            if (col === 0) {
                                widget.addClass('firstcol');
                            } else if (col === this._cols - 1) {
                                widget.addClass('lastcol');
                            }
                            device.appendChildElement(rowElement, this.getWidgetAt(col, row).render(device));
                        } else {
                            var classes = ['spacer'];
                            if (col === 0) {
                                classes.push('firstcol');
                            } else if (col === this._cols - 1) {
                                classes.push('lastcol');
                            }
                            device.appendChildElement(rowElement, device.createContainer(this.id + '_' + col + '_' + row, classes));
                        }
                    }
                    device.appendChildElement(this.outputElement, rowElement);
                }

                return this.outputElement;
            },
            /**
             * Appends a child widget to this widget. Not supported for Grids - use setWidgetAt() instead.
             * @param {antie.widgets.Widget} widget The child widget to add.
             */
            appendChildWidget: function appendChildWidget (/*widget*/) {
                throw new Error('Not supported for Grids - use setWidgetAt() instead.');
            },
            /**
             * Inserts a child widget at the specified index. Not supported for Grids.
             * @param {Integer} index The index where to insert the child widget.
             * @param {antie.widgets.Widget} widget The child widget to add.
             */
            insertChildWidget: function insertChildWidget (/*index, widget*/) {
                throw new Error('Not supported');
            },
            /**
             * Removes a specific child widget from this widget. Not supported for Grids.
             * @param {antie.widgets.Widget} widget The child widget to remove.
             * @param {Boolean} [retainElement] Pass <code>true</code> to retain the child output element of the given widget
             */
            removeChildWidget: function removeChildWidget (/*widget, retainElement*/) {
                throw new Error('Not supported');
            },
            /**
             * Attempt to set focus to the given child widget.
             *
             * Note: You can only set focus to a focusable widget. A focusable widget is one that
             * contains an enabled antie.widgets.Button as either a direct or indirect child.
             *
             * Note: Widgets have 2 independant states: active and focussed. A focussed widget is
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
                var changed = this._activeChildWidget !== widget;
                if (setActiveChildWidget.base.call(this, widget)) {
                    var selectedIndex = this.getIndexOfChildWidget(widget);
                    this._selectedRow = Math.floor(selectedIndex / this._cols);
                    this._selectedCol = Math.floor(selectedIndex % this._cols);

                    if (changed) {
                        this.bubbleEvent(new SelectedItemChangeEvent(this, widget, selectedIndex));
                    }
                    return true;
                } else {
                    return false;
                }
            },
            /**
             * Key handler for grids. Processes KeyEvent.VK_UP, VK_DOWN, VK_LEFT and VK_RIGHT keys and stops propagation
             * if the keypress is handled. Otherwise allows the event to be bubbled up to the parent widget to allow
             * spatial navigation out of the list.
             * @param {antie.events.KeyEvent} evt The key event.
             */
            _onKeyDown: function _onKeyDown (evt) {
                if (evt.keyCode !== KeyEvent.VK_UP && evt.keyCode !== KeyEvent.VK_DOWN &&
                    evt.keyCode !== KeyEvent.VK_LEFT && evt.keyCode !== KeyEvent.VK_RIGHT) {
                    return;
                }

                var _newSelectedCol = this._selectedCol;
                var _newSelectedRow = this._selectedRow;
                var _newSelectedWidget = null;
                do {
                    if (evt.keyCode === KeyEvent.VK_UP) {
                        _newSelectedRow--;
                    } else if (evt.keyCode === KeyEvent.VK_DOWN) {
                        _newSelectedRow++;
                    } else if (evt.keyCode === KeyEvent.VK_LEFT) {
                        _newSelectedCol--;
                    } else if (evt.keyCode === KeyEvent.VK_RIGHT) {
                        _newSelectedCol++;
                    }

                    if (_newSelectedCol < 0) {
                        if(this._horizontalWrapping) {
                            _newSelectedCol = this._cols - 1;
                        } else {
                            break;
                        }
                    }

                    if(_newSelectedCol >= this._cols) {
                        if(this._horizontalWrapping) {
                            _newSelectedCol = 0;
                        } else {
                            break;
                        }
                    }

                    if (_newSelectedRow < 0) {
                        if(this._verticalWrapping) {
                            _newSelectedRow = this._rows - 1;
                        } else {
                            break;
                        }
                    }

                    if(_newSelectedRow >= this._rows) {
                        if(this._verticalWrapping) {
                            _newSelectedRow = 0;
                        } else {
                            break;
                        }
                    }

                    var _newSelectedIndex = (_newSelectedRow * this._cols) + _newSelectedCol;
                    var _widget = this._childWidgetOrder[_newSelectedIndex];
                    if (_widget && _widget.isFocusable()) {
                        _newSelectedWidget = _widget;
                        break;
                    }
                } while (true);

                if (_newSelectedWidget) {
                    this.setActiveChildWidget(_newSelectedWidget);
                    evt.stopPropagation();

                }
            },

            /**
             * Broadcasts an event from the application level to every single
             * object it contains.
             */
            broadcastEvent: function broadcastEvent (evt) {
                this.fireEvent(evt);
                if (!evt.isPropagationStopped()) {
                    for (var i = 0; i < this._childWidgetOrder.length; i++) {
                        // Grids are the only type of container that may contain
                        // null entries in the _childWidgetOrder array
                        if (this._childWidgetOrder[i]) {
                            this._childWidgetOrder[i].broadcastEvent(evt);
                        }
                    }
                }
            }
        });

        Grid.WRAP_MODE = {
            HORIZONTAL: {
                ON: 1,
                OFF: 0
            },

            VERTICAL: {
                ON: 1,
                OFF: 0
            }
        };

        return Grid;
    }
);
