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

(function() {
    /* jshint newcap: false */
    function loadPM(queue, fn) {
        queuedRequire(queue,
            ['antie/devices/anim/css3/propertymap'],
            fn
        );
    }
    
    function restoreUA(method, ua) {
        switch (method) {
            case "getOverride":
            navigator.__defineGetter__(
                'userAgent', 
                function() {
                    return(ua);
                }
            );
            break;
        }
    }
    
    function detectSpoofMode() { 
        var oldUa = navigator.userAgent;
        navigator.__defineGetter__(
            'userAgent', 
            function() {
                return("Spoofed");
            }
        );
        
        if (navigator.userAgent === "Spoofed") {
            restoreUA('getOverride', oldUa);
            return('getOverride');
        } 
        
        return('navOverride');
    }
    
    function setSpoofedUANavigator(uaSpoofMode, userAgent) {
        var newNav;
        switch (uaSpoofMode) {
            case "getOverride":
                navigator.__defineGetter__(
                    'userAgent', 
                    function() {
                        return(userAgent);
                    }
                );
            break;
            
            case "navOverride":
                newNav = {};
                newNav.userAgent = userAgent;
                navigator = newNav;
            break;
        }  
    }
    
    this.PropertyMapTest = AsyncTestCase("PropertyMap");

    this.PropertyMapTest.prototype.setUp = function() {

        this.sandbox = sinon.sandbox.create();
        this.oldUA = navigator.userAgent;
        this.oldNav = navigator;
        this.uaSpoofMode = detectSpoofMode();
    };

    this.PropertyMapTest.prototype.tearDown = function() {
        restoreUA(this.uaSpoofMode, this.oldUA);
        navigator = this.oldNav;
        delete this.oldNav;
        delete this.oldUA;
        delete this.uaSpoofMode;
        this.sandbox.restore();
    };
    
    this.PropertyMapTest.prototype.testSniffPrefix = function(queue) {
        var self = this;
        loadPM(queue,
            function(PropertyMap) {
                var pMap, oldUa;
                oldUa = navigator.userAgent;
                pMap = new PropertyMap();
                setSpoofedUANavigator(self.uaSpoofMode, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17");
                assertEquals("Chrome UA detected as -webkit- prefix", "-webkit-", pMap._sniffPrefix());
                setSpoofedUANavigator(self.uaSpoofMode, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:17.0) Gecko/20100101 Firefox/17.0");
                assertEquals("Firefox UA detected as -moz- prefix", "-moz-", pMap._sniffPrefix());
                setSpoofedUANavigator(self.uaSpoofMode, "Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8) Presto/2.12.388 Version/12.12");
                assertEquals("Opera UA detected as -o- prefix", "-o-", pMap._sniffPrefix());
                setSpoofedUANavigator(self.uaSpoofMode, oldUa);
            }
        );
    };
    
    this.PropertyMapTest.prototype.testPropertiesPrefixedAndAppliedToMap = function(queue) {
        loadPM(queue,
            function(PropertyMap) {
                var pMap, properties, i;
                pMap = new PropertyMap('-myPrefix-');
                properties = pMap._properties;
                for(i = 0; i !== pMap._properties.length; i+=1) {
                    assertEquals(pMap[pMap._properties[i]], '-myPrefix-' + pMap._properties[i]);
                }
            }
        );
    };
    
    this.PropertyMapTest.prototype.testCorrectCallbackEventsRegistered = function(queue) {
        loadPM(queue,
            function(PropertyMap) {
                var webkitMap, ffMap, operaMap, futureMap;
                webkitMap = new PropertyMap('-webkit-');
                ffMap = new PropertyMap('-moz-');
                operaMap = new PropertyMap('-o-');
                futureMap = new PropertyMap('');
                
                assertEquals(['webkitTransitionEnd'], webkitMap.transitionEndEvents);
                assertEquals(['transitionend'], ffMap.transitionEndEvents);
                assertEquals(['oTransitionEnd', 'otransitionend'], operaMap.transitionEndEvents);
                assertEquals(['transitionend'], futureMap.transitionEndEvents);
            }
        );
    };
    
}());
