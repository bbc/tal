/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.binder class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/binder',
    [
        'antie/class',
        'antie/iterator',
        'antie/events/databoundevent'
    ],
    function (Class, Iterator, DataBoundEvent) {
        'use strict';
        /**
         * Class for adding children to an existing widget based on a combination
         * of a data source and formatter.
         * @name antie.widgets.carousel.Binder
         * @class
         * @extends antie.Class
         */
        var Binder = Class.extend(/** @lends antie.widgets.carousel.Binder.prototype */ {
            /**
             * @constructor
             * @ignore
             */
            init: function init (formatter, dataSource) {
                this._dataSource = dataSource;
                this._formatter = formatter;
            },

            /**
             * Creates new widgets which are then appended to
             * the widget supplied. Continues until the end of the data returned
             * by the source is reached.
             * @param widget The parent of the widgets to be created.
             */
            appendAllTo: function appendAllTo (widget) {
                this._bindAll(widget, this._appendItem);
            },

            _bindAll: function _bindAll (widget, processItemFn, preBindFn, postBindFn) {
                var callbacks, beforeBindEvent;

                callbacks = this._getCallbacks(widget, processItemFn, postBindFn);
                beforeBindEvent = new DataBoundEvent('beforedatabind', widget);

                if (typeof preBindFn === 'function') {
                    preBindFn(beforeBindEvent);
                }

                widget.bubbleEvent(beforeBindEvent);
                if (!(this._dataSource instanceof Array)) {
                    this._dataSource.load(callbacks);
                } else {
                    callbacks.onSuccess(this._dataSource);
                }

            },

            _getCallbacks: function _getCallbacks (widget, processItemFn, postBindFn) {
                var self = this;
                return {
                    onSuccess: function onSuccess (data) {
                        var it, boundItem, dataBoundEvent;
                        if (data instanceof Iterator) {
                            it = data;
                        } else {
                            it = new Iterator(data);
                        }

                        while (it.hasNext()) {
                            boundItem = self._formatter.format(it);
                            processItemFn(widget, boundItem);
                        }

                        dataBoundEvent = new DataBoundEvent('databound', widget, it);
                        if (typeof postBindFn === 'function') {
                            postBindFn(dataBoundEvent);
                        }

                        widget.bubbleEvent(dataBoundEvent);
                    },
                    onError: function onError (error) {
                        widget.bubbleEvent(new DataBoundEvent('databindingerror', widget, null, error));
                    }
                };
            },

            _appendItem: function _appendItem (widget, item) {
                return widget.appendChildWidget(item);
            }
        }
        );
        return Binder;
    }
);
