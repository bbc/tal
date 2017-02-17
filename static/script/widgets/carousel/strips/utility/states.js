/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.strips.utility.states class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define('antie/widgets/carousel/strips/utility/states',
    [
        'antie/widgets/carousel/strips/utility/initstate',
        'antie/widgets/carousel/strips/utility/renderedstate',
        'antie/widgets/carousel/strips/utility/attachedstate'
    ],
    function (InitState, RenderedState, AttachedState) {
        'use strict';
        return {
            INIT: InitState,
            RENDERED: RenderedState,
            ATTACHED: AttachedState
        };
    }
);
