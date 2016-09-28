/**
 * @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
 * @license See https://github.com/fmtvp/tal/blob/master/LICENSE for full licence
 */

define(
    'antie/devices/anim/css3/skipanimtransitiondefinition',
    [
        'antie/devices/anim/css3/transitiondefinition'
    ],
    function(TransitionDefinition) {
        'use strict';
        return TransitionDefinition.extend(
            {
                init: function (transDef) {
                    this._super();
                    this._copyToSelf(transDef);
                },
                
                _copyToSelf: function(transDef) {
                    var props, property, i;
                    props = transDef.getProperties();
                    for(i = 0; i !== props.length; i += 1) {
                        property = props[i];
                        this.setProperty(
                            property, 
                            {
                                duration: transDef.getPropertyDuration(property),
                                delay: transDef.getPropertyDelay(property),
                                timingFn: transDef.getPropertyTimingFn(property)
                            }
                        );
                    }
                },
                
                getPropertyDuration: function () {
                    return 0;
                }
            }
            
            
        );
    }
);
