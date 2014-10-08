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

require.def ('antie/widgets/state_view_container', [
    'antie/widgets/container',
    'antie/events/keyevent',
    'antie/widgets/button'
], function(Container, KeyEvent, Button){
    'use strict';

    var keyMapping = { }
    keyMapping[KeyEvent.VK_UP] = 'up';
    keyMapping[KeyEvent.VK_DOWN] = 'down';
    keyMapping[KeyEvent.VK_LEFT] = 'left';
    keyMapping[KeyEvent.VK_RIGHT] = 'right';
    keyMapping[KeyEvent.VK_BACK] = 'back';

     var StateViewContainer = Container.extend( {

        init:function(controller) {
            this._super();

            var self = this;


            this.focusButtonHack = new Button();
            this.appendChildWidget(this.focusButtonHack);

            this.addEventListener("select",  function() { controller.select(); });

            this.addEventListener("keydown", function(evt){
               var mappedFunctionName = keyMapping[evt.keyCode];
                if (mappedFunctionName){
                   controller[mappedFunctionName]();
               }
            });

            this.addEventListener("afterhide", function(evt) {
                  self.focusHack();
            });

            this.addEventListener("beforeshow", function(evt) {
                   self.getCurrentApplication().setActiveComponent(evt.component.id);
            });

        },
        focusHack: function() {
           this._isFocussed = true;
           this.focusButtonHack.focus();
        }
    } )

    return StateViewContainer;

});