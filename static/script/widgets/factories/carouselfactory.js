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
require.def('antie/widgets/factories/carouselfactory',
    [
        'antie/class',
        'antie/widgets/carousel',
        'antie/widgets/carousel/keyhandlers/alignfirsthandler',
        'antie/widgets/carousel/navigators/wrappingnavigator',
        'antie/widgets/carousel/strips/wrappingstrip'
    ],
    function (Class, Carousel, AlignFirstHandler, WrappingNavigator, WrappingStrip) {
        "use strict";
        return Class.extend({
            newVerticalBookendedAlignFirstCarousel: function (id) {
                var carousel, handler;
                carousel = new Carousel(id, Carousel.orientations.VERTICAL);
                handler = new AlignFirstHandler();
                handler.attach(carousel);
                return carousel;
            },

            newVerticalVisuallyWrappedAlignFirstCarousel: function (id) {
                var carousel, handler;
                carousel = new Carousel(id, Carousel.orientations.VERTICAL);
                carousel.setNavigator(WrappingNavigator);
                carousel.setWidgetStrip(WrappingStrip);
                handler = new AlignFirstHandler();
                handler.attach(carousel);
                return carousel;
            }
        });
    }
);