/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
 */

define (
    'antie/widgets/state_view_container',
    [
        'antie/widgets/container',
        'antie/events/keyevent',
        'antie/widgets/button'
    ], function(Container, KeyEvent, Button){
        'use strict';

        var keyMapping = { };
        keyMapping[KeyEvent.VK_UP] = 'up';
        keyMapping[KeyEvent.VK_DOWN] = 'down';
        keyMapping[KeyEvent.VK_LEFT] = 'left';
        keyMapping[KeyEvent.VK_RIGHT] = 'right';
        keyMapping[KeyEvent.VK_BACK] = 'back';

        var StateViewContainer = Container.extend( {

            init: function init (controller) {
                init.base.call(this);

                var self = this;


                this.focusButtonHack = new Button();
                this.appendChildWidget(this.focusButtonHack);

                this.addEventListener('select',  function() {
                    controller.select();
                });

                this.addEventListener('keydown', function(evt){
                    var mappedFunctionName = keyMapping[evt.keyCode];
                    if (mappedFunctionName){
                        controller[mappedFunctionName]();
                    }
                });


                this.addEventListener('afterhide', function() {
                    self.focusHack();
                });


                this.addEventListener('beforeshow', function(evt) {
                    self.getCurrentApplication().setActiveComponent(evt.component.id);
                });

            },
            focusHack: function focusHack () {
                this._isFocussed = true;
                this.focusButtonHack.focus();
            }
        } );

        return StateViewContainer;

    });
