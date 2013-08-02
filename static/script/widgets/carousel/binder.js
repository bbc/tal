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
         * The binder allows data binding to widgets supporting the v2 carousel interface
         * @name antie.Binder
         * @class
         * @extends antie.Class
         */
        var Binder = Class.extend(/** @lends antie.Class.prototype */ {
                init: function (formatter, dataSource) {
                    this._dataSource = dataSource;
                    this._formatter = formatter;
                },

                bindAll: function (widget) {
                    var callbacks, self, it;
                    self = this;

                    callbacks = {
                        onSuccess: function (data) {
                            var boundItem;
                            if (data instanceof Iterator) {
                                it = data;
                            } else {
                                it = new Iterator(data);
                            }

                            while (it.hasNext()) {
                                boundItem = self._formatter.format(it);
                                widget.appendChildWidget(boundItem);
                            }

                            widget.bubbleEvent(new DataBoundEvent("databound", widget, it));
                        },
                        onError: function (error) {
                            widget.bubbleEvent(new DataBoundEvent("databindingerror", widget, null, error));
                        }
                    };

                    widget.bubbleEvent(new DataBoundEvent("beforedatabind", widget));
                    if (!(this._dataSource instanceof Array)) {
                        this._dataSource.load(callbacks);
                    } else {
                        callbacks.onSuccess(this._dataSource);
                    }

                }
            }
        );

        return Binder;
    }
);
/**
 * @constructor
 * @ignore
 */