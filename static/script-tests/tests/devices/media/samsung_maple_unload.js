/**
 * @preserve Copyright (c) 2014 British Broadcasting Corporation
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

jstestdriver.console.warn("devices/media/samsung_maple.js is poorly tested!");

(function() {

    var config = {"modules":{"base":"antie/devices/browserdevice","modifiers":["antie/devices/media/samsung_maple_unload"]}, "input":{"map":{}},"layouts":[{"width":960,"height":540,"module":"fixtures/layouts/default","classes":["browserdevice540p"]}],"deviceConfigurationKey":"devices-html5-1"};

    this.SamsungMapleTest = AsyncTestCase("SamsungMapleTest");

    this.SamsungMapleTest.prototype.setUp = function() {
        this.sandbox = sinon.sandbox.create();

        // If we don't have a TVMW plugin create it...
        this.createdTVMPlugin = false;
        this.tvmwPlugin = document.getElementById('pluginObjectTVMW');
        if (!this.tvmwPlugin) {
            this.tvmwPlugin = document.createElement('object');
            this.tvmwPlugin.id = 'pluginObjectTVMW';
            document.body.appendChild(this.tvmwPlugin);
            this.createdTVMPlugin = true;

            this.tvmwPlugin.GetSource = this.sandbox.stub();
            this.tvmwPlugin.SetSource = this.sandbox.stub();
            this.tvmwPlugin.SetMediaSource = this.sandbox.stub();

        } else {
            this.sandbox.stub(this.tvmwPlugin, "GetSource");
            this.sandbox.stub(this.tvmwPlugin, "SetSource");
        }

        // If we don't have a Player plugin create it...
        this.createdPlayerPlugin = false;
        //this.playerPlugin = document.getElementById('playerPlugin');
        //if (!this.playerPlugin) {
            this.playerPlugin = document.createElement('object');
            this.playerPlugin.id = 'playerPlugin';
            document.body.appendChild(this.playerPlugin);
            this.createdPlayerPlugin = true;

            this.playerPlugin.GetDuration = this.sandbox.stub();
            this.playerPlugin.Stop = this.sandbox.stub();
            this.playerPlugin.Pause = this.sandbox.stub();
            this.playerPlugin.Resume = this.sandbox.stub();
            this.playerPlugin.SetDisplayArea = this.sandbox.stub();
            this.playerPlugin.JumpForward = this.sandbox.stub();
        //}
    };

    this.SamsungMapleTest.prototype.tearDown = function() {
        this.sandbox.restore();

        // Get rid of the TVMW plugin if we've created it.
        if (this.createdTVMPlugin) {
            document.body.removeChild(this.tvmwPlugin);
            this.tvmwPlugin = null;
        }

        // Get rid of the Player plugin if we've created it.
        if (this.createdPlayerPlugin) {
            document.body.removeChild(this.playerPlugin);
            this.playerPlugin = null;
        }

        // Get rid of event handling that Samsung litters the window with.
        window.SamsungMapleOnBufferingStart = undefined;
        window.SamsungMapleOnBufferingComplete = undefined;
        window.SamsungMapleOnConnectionFailed = undefined;
        window.SamsungMapleOnNetworkDisconnected = undefined;
        window.SamsungMapleOnRenderError = undefined;
        window.SamsungMapleOnStreamNotFound = undefined;
        window.SamsungMapleOnRenderingComplete = undefined;
        window.SamsungMapleOnStreamInfoReady = undefined;
        window.SamsungMapleOnCurrentPlayTime = undefined;
        window.SamsungMapleOnTimeUpdate = undefined;
    };

    this.SamsungMapleTest.prototype.testThatStopIsCalledOnThePlayerPluginWhenAUnloadEventIsFired = function (queue) {
      expectAsserts(1);
      var self = this;
        queuedApplicationInit(queue, 'lib/mockapplication', ["antie/devices/media/samsung_maple_unload", "antie/events/mediaevent"],
            function(application, SamsungPlayer,  MediaErrorEvent) {

              var callbackStub = self.sandbox.stub();
              var mediaInterface = application.getDevice().createMediaInterface("id", "video", callbackStub);

              var event = new CustomEvent('unload');
              window.dispatchEvent(event);
              assertTrue(this.playerPlugin.Stop.calledOnce);
            }, config);
    };

})();
