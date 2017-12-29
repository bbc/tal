/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.visibilitystates class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/widgets/carousel/strips/utility/visibilitystates',
    [
        'antie/widgets/carousel/strips/utility/initstate',
        'antie/widgets/carousel/strips/utility/hiddenstate',
        'antie/widgets/carousel/strips/utility/visiblestate'
    ],
    function (InitState, HiddenState, VisibleState) {
        'use strict';
        return {
            INIT: InitState,
            HIDDEN: HiddenState,
            ATTACHED: VisibleState
        };
    }
);
