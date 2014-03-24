/**
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
require.def('antie/widgets/carousel/binder',
    [
        'antie/class',
        'antie/iterator',
        'antie/events/databoundevent'
    ],
    function (Class, Iterator, DataBoundEvent) {
        "use strict";
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
                init: function (formatter, dataSource) {
                    this._dataSource = dataSource;
                    this._formatter = formatter;
                },

                /**
                 * Creates new widgets which are then appended to
                 * the widget supplied. Continues until the end of the data returned
                 * by the source is reached.
                 * @param widget The parent of the widgets to be created.
                 */
                appendAllTo: function (widget) {
                    this._bindAll(widget, this._appendItem);
                },

                _bindAll: function (widget, processItemFn, preBindFn, postBindFn) {
                    var callbacks, beforeBindEvent;

                    callbacks = this._getCallbacks(widget, processItemFn, postBindFn);
                    beforeBindEvent = new DataBoundEvent("beforedatabind", widget);

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

                _getCallbacks: function (widget, processItemFn, postBindFn) {
                    var self = this;
                    return {
                        onSuccess: function (data) {
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

                            dataBoundEvent = new DataBoundEvent("databound", widget, it);
                            if (typeof postBindFn === 'function') {
                                postBindFn(dataBoundEvent);
                            }

                            widget.bubbleEvent(dataBoundEvent);
                        },
                        onError: function (error) {
                            widget.bubbleEvent(new DataBoundEvent("databindingerror", widget, null, error));
                        }
                    };
                },

                _appendItem: function (widget, item) {
                    return widget.appendChildWidget(item);
                }
            }
        );
        return Binder;
    }
);
