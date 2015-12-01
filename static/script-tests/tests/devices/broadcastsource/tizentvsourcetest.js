/**
 * @preserve Copyright (c) 2013-2014 British Broadcasting Corporation
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

(function () {
    this.tizentvSource = AsyncTestCase("Tizen Broadcast Source"); //jshint ignore:line

    var stubTizenTVSpecificApis = function(self) {
        window.tizen = {
            tvchannel : "BBC One",
            tvwindow : {},
            tvaudiocontrol:{}
        };

        window.tizen.tvaudiocontrol.getVolume  = function() {
            return 10;
        };

        window.tizen.tvwindow.hide = function(){

        }


    }

    var removeTizenTVSpecificApis = function(self){
        window.tizen = null;
    }

    var getGenericTizenTVConfig = function () {
        return {
            modules: {base: "antie/devices/browserdevice", modifiers: [
                "antie/devices/anim/styletopleft",
                "antie/devices/media/html5",
                "antie/devices/net/default",
                "antie/devices/broadcastsource/tizentvsource",
                "antie/devices/data/nativejson",
                "antie/devices/storage/cookie",
                "antie/devices/logging/default",
                "antie/devices/exit/closewindow"
            ]}, input: {map: {}}, layouts: [
                {width: 1280, height: 720, module: "fixtures/layouts/default", classes: ["browserdevice720p"]}
            ], deviceConfigurationKey: "devices-html5-1"};
    };

    this.tizentvSource.prototype.setUp = function () {
        this.sandbox = sinon.sandbox.create();
        stubTizenTVSpecificApis(this);
    };

    this.tizentvSource.prototype.tearDown = function () {
        removeTizenTVSpecificApis();
        this.sandbox.restore();
    };

    this.tizentvSource.prototype.testCreateBroadcastSourceReturnsHBBTVObject = function (queue) {
        expectAsserts(2);

        var config = getGenericTizenTVConfig();
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/basetvsource"], function (application, BaseTvSource) {
            var device = application.getDevice();
            var returnedBroadcastSource = device.createBroadcastSource();

            assertEquals('BroadcastSource should be an object', 'object', typeof returnedBroadcastSource);
            assert('BrowserDevice should extend from Device', returnedBroadcastSource instanceof BaseTvSource);
            // also check that is it of type tizentvSource
        }, config);
    };


    this.tizentvSource.prototype.testCreateBroadcastSourceReturnsSingletonTizenTVObject = function(queue) {
        expectAsserts(1);

        var config = getGenericTizenTVConfig();
        var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/broadcastsource/tizentvsource"], function(application, TizenTVSource) {
            var device = application.getDevice();

            var tizenTVConstructor = self.sandbox.spy(TizenTVSource.prototype, "init");

            device.createBroadcastSource();
            device.createBroadcastSource();
            device.createBroadcastSource();

            assertTrue('BroadcastSource should be an object', tizenTVConstructor.calledOnce);

        }, config);
    };



})();
