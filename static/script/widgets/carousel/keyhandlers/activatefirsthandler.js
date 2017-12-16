/**
 * @fileOverview Requirejs module containing the antie.widgets.carousel.keyhandlers.activatefirsthandler class.
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/widgets/carousel/keyhandlers/activatefirsthandler',
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
        'use strict';
        return KeyHandler.extend(/** @lends antie.widgets.carousel.keyhandlers.AlignFirstHandler.prototype */{
            _addAlignmentListeners: function _addAlignmentListeners () {
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
