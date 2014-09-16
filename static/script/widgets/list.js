/**
 * @fileOverview Requirejs module containing the antie.widgets.List class.
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

require.def('antie/widgets/list',
	[
		'antie/widgets/container',
		'antie/widgets/listitem',
		'antie/iterator',
		'antie/events/databoundevent',
		'antie/events/selecteditemchangeevent'
	],
	function(Container, ListItem, Iterator, DataBoundEvent, SelectedItemChangeEvent) {
		'use strict';
		/**
		 * The List widget contains an ordered list of items which may be populated either by a static
		 * array or by binding to an asynchronous data source.
		 * Note: The List widget has no spatial navigation. See {@link antie.widgets.VerticalList}
		 * and {@link antie.widgets.HorizontalList} for widgets that support spatial navigation.
		 * @name antie.widgets.List
		 * @class
		 * @extends antie.widgets.Container
		 * @requires antie.widgets.ListItem
		 * @requires antie.Iterator
		 * @requires antie.events.DataBoundEvent
		 * @requires antie.events.SelectedItemChangeEvent
		 * @param {String} [id] The unique ID of the widget. If excluded, a temporary internal ID will be used (but not included in any output).
		 * @param {antie.Formatter} [itemFormatter] A formatter class used on each data item to generate the list item child widgets.
		 * @param {antie.DataSource|Array} [dataSource] An array of data to be used to generate the list items, or an asynchronous data source.
		 */
		var List = Container.extend(/** @lends antie.widgets.List.prototype */ {
			/**
			 * @constructor
			 * @ignore
			 */
			init: function(id, itemFormatter, dataSource) {
				this._selectedIndex = 0;
				this._dataSource = dataSource;
				this._itemFormatter = itemFormatter;
				this._dataBound = false;
				this._totalDataItems = 0;
				this._renderMode = List.RENDER_MODE_CONTAINER;
				this._dataBindingOrder = List.DATA_BIND_FORWARD;

				this._super(id);
				this.addClass('list');
			},
			/**
			 * Appends a child widget to this widget, creating a new list item.
			 * @param {antie.widgets.Widget} widget The child widget to add.
			 */
			appendChildWidget: function(widget) {
				if ((this._renderMode == List.RENDER_MODE_LIST) && !(widget instanceof ListItem)) {
					var li = new ListItem();
					li.appendChildWidget(widget);
					li.setDataItem(widget.getDataItem());
					this._super(li);
					return li;
				} else {
					widget.addClass('listitem');
					this._super(widget);
					return widget;
				}
			},
			/**
			 * Inserts a child widget at the specified index.
			 * @param {Integer} index The index where to insert the child widget.
			 * @param {antie.widgets.Widget} widget The child widget to add.
			 */
			insertChildWidget: function(index, widget) {
				var w;
				if ((this._renderMode == List.RENDER_MODE_LIST) && !(widget instanceof ListItem)) {
					w = new ListItem();
					w.appendChildWidget(widget);
					w.setDataItem(widget.getDataItem());
					this._super(index, w);
				} else {
				    widget.addClass('listitem');
					this._super(index, widget);
					w = widget;
				}
				if (index <= this._selectedIndex && 
						(( this._selectedIndex + 1 ) < this.getChildWidgetCount()) ) {
					this._selectedIndex++;
				}
				return widget;
			},
			/**
			 * Attempt to set focus to the given child widget.
			 * Note: You can only set focus to a focusable widget. A focusable widget is one that
			 * contains an enabled antie.widgets.Button as either a direct or indirect child.
			 * @param {antie.widgets.Widget} widget The child widget to set focus to.
			 * @returns Boolean true if the child widget was focusable, otherwise boolean false.
			 */
			setActiveChildWidget: function(widget) {
				var changed = this._activeChildWidget != widget;
				if (this._super(widget)) {
					this._selectedIndex = this.getIndexOfChildWidget(widget);
					if (changed) {
						this.bubbleEvent(new SelectedItemChangeEvent(this, widget, this._selectedIndex));
					}
					return true;
				} else {
					return false;
				}
			},
			/**
			 * Renders the widget and any child widgets to device-specific output. If the list is bound
			 * to an asynchronous data source, get the data.
			 * @param {antie.devices.Device} device The device to render to.
			 * @returns A device-specific object that represents the widget as displayed on the device (in a browser, a DOMElement);
			 */
			render: function(device) {
				if (!this._dataBound && this._dataSource && this._itemFormatter) {
					this._createDataBoundItems(device);
				}
				if (!this.outputElement && (this._renderMode == List.RENDER_MODE_LIST)) {
					this.outputElement = device.createList(this.id, this.getClasses());
				}
				return this._super(device);
			},
			/**
			 * Create list items from the bound data.
			 * @private
			 * @param {antie.devices.Device} device The device to render to.
			 */
			_createDataBoundItems: function(device) {
				this._dataBound = true;

				var self = this;

				function processDataCallback (data) {
					self.removeChildWidgets();

					var iterator = (data instanceof Iterator) ? data : new Iterator(data);
					while (iterator.hasNext()) {
						var i = iterator._currentIndex;

						var w = self._itemFormatter.format(iterator);
						w._listIndex = i;
						if(self._dataBindingOrder === List.DATA_BIND_FORWARD) {
							self.appendChildWidget(w)
						} else if(self._dataBindingOrder === List.DATA_BIND_REVERSE){
							self.insertChildWidget(0, w);
						}
					}
					self._totalDataItems = iterator._currentIndex;

					self.bubbleEvent(new DataBoundEvent("databound", self, iterator));
				}

				function processDataError (response) {
					self.removeChildWidgets();
					self.bubbleEvent(new DataBoundEvent("databindingerror", self, null, response));
				}

				self.bubbleEvent(new DataBoundEvent("beforedatabind", self));
				if (!this._dataSource || (this._dataSource instanceof Array)) {
					processDataCallback(this._dataSource);
				} else {
					this._dataSource.load({
						onSuccess: processDataCallback,
						onError: processDataError
					});
				}
			},
			/**
			 * Binds the list to a different data source. If the list is already rendered,
			 * the output will be updated to reflect the new data.
			 * @param {antie.DataSource} dataSource The data source to bind to.
			 */
			setDataSource: function(dataSource) {
				// abort currently processing data requests
				if (this._dataSource && typeof(this._dataSource.abort) === "function") {
					this._dataSource.abort();
				}
				this._dataSource = dataSource;
				if (this.outputElement) {
					this._createDataBoundItems(this.getCurrentApplication().getDevice());
				}
			},
			/**
			 * Invalidates the data-related bindings - causing items to be re-created on next render;
			 */
			resetDataBindings: function() {
				this._dataBound = false;
			},
			/**
			 * Re-iterates the data source, recreating list items.
			 */
			rebindDataSource: function() {
				this._dataBound = false;
				this.setDataSource(this._dataSource);
			},
			/**
			 * Sets the rendering mode to either <code>List.RENDER_MODE_CONTAINER</code> or <code>List.RENDER_MODE_LIST</code>.
			 * List.RENDER_MODE_CONTAINER causes the list to be rendered as a generic container (e.g. &lt;div&gt;), with a generic container for each
			 * list item. List.RENDER_MODE_LIST causes the list to be rendered as a list (e.g. &lt;ul&gt;), with list item elements (e.g. &lt;li&gt;) for each item.
			 * @param {Integer} mode The rendering mode to use.
			 */
			setRenderMode: function(mode) {
				this._renderMode = mode;
			},
			/**
			 * Binds a progress indicator widget to this list.
			 * @param {antie.Widgets.HorizontalProgress} widget The progress indicator widget.
			 * @param {Function} [formatterCallback] A function that tkes the current item index and the total number of items and returns
			 *					a string to popular the progress indicator's label.
			 */
			bindProgressIndicator: function(widget, formatterCallback) {
				var self = this;

				this._updateProgressHandler = function(evt) {
					if (evt.target !== self) {
						return;
					}

					if (evt.type == 'beforedatabind') {
						widget.setText("");
						return;
					}

					// TODO: This is a bit of a hack - if more data items were iterated over to populate the list
					// TODO: than there are items in the list, we assume some list items contain more than one
					// TODO: data item, therefore we have to use their position within the data source, rather than
					// TODO: their position within the rendered list widget.


					var ignore = self._childWidgetOrder.length - self._totalDataItems;

					if (ignore < 0) {
						ignore = 0;
					}

					var activeWidget = self.getActiveChildWidget();
					var index = (self._dataBound && activeWidget && (activeWidget._listIndex !== undefined))
						? activeWidget._listIndex
						: self._selectedIndex - ignore;

					var total = self._childWidgetOrder.length - ignore;

					var p;
					if (index < 0) {
						p = 0;
					} else {
						p = index / (total - 1);
						if (p < 0) {
							p = 0;
						}
					}

					if (formatterCallback) {
						var val = formatterCallback(index + 1, total);
						if (typeof(val) == 'string') {
							widget.setText(val);
						} else {
							widget.setText(val.text);
							p = val.pos;
						}
					}

					//if the formatter function has moved the position indicator, we don't change it
					widget.setValue(p);
				};
				this.addEventListener('selecteditemchange', this._updateProgressHandler);
				this.addEventListener('focus', this._updateProgressHandler);
				this.addEventListener('blur', this._updateProgressHandler);
				this.addEventListener('beforedatabind', this._updateProgressHandler);
				this.addEventListener('databound', this._updateProgressHandler);
			},
			/**
			 * Unbinds a previously-bound progress indicator widget.
			 */
			unbindProgressIndicator: function() {
				if (this._updateProgressHandler) {
					this.removeEventListener('selecteditemchange', this._updateProgressHandler);
					this.removeEventListener('focus', this._updateProgressHandler);
					this.removeEventListener('blur', this._updateProgressHandler);
					this.removeEventListener('databound', this._updateProgressHandler);
				}
			},

			removeChildWidget: function(widget) {
				// TODO: Make this more generic - it will only work if carousel items contain a
				// TODO: single item of data.
				if (this._updateProgressHandler && (this._childWidgetOrder.length < this._totalDataItems)) {
					this.getCurrentApplication().getDevice().getLogger().warn("antie.widgets.List::removeChildWidget - removing"
						+ " list items where multiple data items are contained within each list item"
						+ " can cause unintended behaviour within any position indicator attached"
						+ " to the list.");
				}

				var ignore = this._childWidgetOrder.length - this._totalDataItems;
				this._totalDataItems--;
				var retValue = this._super(widget);
				widget.removeClass('listitem');

				for (var i = 0; i < this._childWidgetOrder.length; i++) {
					this._childWidgetOrder[i]._listIndex = i - ignore;
				}
				return retValue;
			},
			removeChildWidgets: function() {
				for (var i = 0; i < this._childWidgetOrder.length; i++) {
					this._childWidgetOrder[i].removeClass('listitem');
				}

				this._totalDataItems = 0;
				return this._super();
			},

			setDataBindingOrder: function(order) {
				this._dataBindingOrder = order;
			},

			getDataBindingOrder: function() {
				return this._dataBindingOrder;
			}
		});

		/**
		 * Render as a generic container (e.g. &lt;div&gt;), with a generic container for each list item.
		 * @name RENDER_MODE_CONTAINER
		 * @memberOf antie.widgets.List
		 * @constant
		 * @static
		 */
		List.RENDER_MODE_CONTAINER = 1;
		/**
		 * Render as a list (e.g. &lt;ul&gt;), with list item elements (e.g. &lt;li&gt;) for each item.
		 * @name RENDER_MODE_LIST
		 * @memberOf antie.widgets.List
		 * @constant
		 * @static
		 */
		List.RENDER_MODE_LIST = 2;

		List.DATA_BIND_FORWARD = 0;
		List.DATA_BIND_REVERSE = 1;

		return List;
	}
);
