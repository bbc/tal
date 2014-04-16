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
require.def('antie/widgets/carousel/keyhandlers/activatefirsthandler',
    [
        'antie/widgets/carousel/keyhandlers/keyhandler'
    ],
    /**
     * The base ActivateFirstHandler class moves alignment in the same way as the base Keyhandler class
     * Before alignment is started, the active widget is changed to the next focusable widget.
     * @name antie.widgets.carousel.keyhandlers.ActivateFirstHandler
     * @class
     * @extends antie.widgets.carousel.keyhandlers.KeyHandler
     */
    function (KeyHandler) {
        "use strict";
        return KeyHandler.extend(/** @lends antie.widgets.carousel.keyhandlers.AlignFirstHandler.prototype */{
            _addAlignmentListeners: function () {
                var carousel = this._carousel;
                carousel.addEventListener('beforealign', function (ev) {
                    if (ev.target === carousel) {
                        carousel.setActiveIndex(ev.alignedIndex);
                    }
                });
            }
        });
    }
);