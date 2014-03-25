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
require.def('antie/widgets/carousel/orientations/horizontal',
    [
        'antie/class',
        'antie/events/keyevent'
    ],
    /**
     * Class to encapsulate any data specific to a horizontal orientation
     * @name antie.widgets.carousel.orientations.Horizontal
     * @extends antie.Class
     * @class
     */
    function (Class, KeyEvent) {
        "use strict";
        var Horizontal = Class.extend(/** @lends antie.widgets.carousel.orientations.Horizontal.prototype */ {
            dimension: function () {
                return 'width';
            },
            edge: function () {
                return 'left';
            },
            styleClass: function () {
                return 'horizontal';
            },
            defaultKeys: function () {
                return {
                    PREVIOUS: KeyEvent.VK_LEFT,
                    NEXT: KeyEvent.VK_RIGHT
                };
            }
        });

        return new Horizontal();
    }
);