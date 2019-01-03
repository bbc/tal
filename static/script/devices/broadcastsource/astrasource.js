/**
* @fileOverview Requirejs module containing base antie.devices.broadcastsource.astrasource class.
* @preserve Copyright (c) 2013-present British Broadcasting Corporation. All rights reserved.
* @license See https://github.com/bbc/tal/blob/master/LICENSE for full licence
*/

define(
  'antie/devices/broadcastsource/astrasource',
  [
    'antie/devices/browserdevice',
    'antie/devices/broadcastsource/basetvsource',
    'antie/runtimecontext',
    'antie/events/tunerpresentingevent',
    'antie/events/tunerstoppedevent'
  ],
  function (Device, BaseTvSource, RuntimeContext, TunerPresentingEvent, TunerStoppedEvent ) {
    'use strict';

    var DOM_ELEMENT_TAG = 'video';
    var AstraSource = BaseTvSource.extend(/** @lends antie.devices.broadcastsource.astrasource.prototype */ {
      /**
      * @constructor
      * @ignore
      */
      init: function init () {

        var self = this;
        this._videoTag = document.getElementsByTagName(DOM_ELEMENT_TAG)[0];

        // adding as instance rather then class var as module instantiated via method
        this._playStates = {
          UNREALIZED: 0,
          CONNECTING: 1,
          PRESENTING: 2,
          STOPPED: 3
        };

        this.playState = this._playStates.STOPPED;

      },
      _createAndSetBroadcastVideoTag: function _createAndSetVideoTag() {

        this._videoTag = document.createElement('video');
        this._videoTag.autoplay = "autoplay";
        this._videoTag.style["position"] = "absolute";
        this._videoTag.style["top"] = "0px";
        this._videoTag.style["left"] = "0px";
        this._videoTag.style["width"] = "100%";
        this._videoTag.style["height"] = "100%";

        var sourceTag = document.createElement('source');
        sourceTag.src = "rec://srv/cur";
        sourceTag.type = "video/x-dvb";

        this._videoTag.appendChild(sourceTag);
        document.body.appendChild(this._videoTag);

        this.playState = this._playStates.PRESENTING;
        //emit a TunerPresentingEvent
        RuntimeContext.getCurrentApplication().broadcastEvent(new TunerPresentingEvent(""));

      },
      showCurrentChannel: function showCurrentChannel() {
        this._createAndSetBroadcastVideoTag();
      },
      _removeBroadcastVideoTag: function _removeBroadcastVideoTag() {

        if(this._videoTag) {
          this._videoTag.parentNode.removeChild(this._videoTag);
          this._videoTag = null;
        }

        this.playState = this._playStates.STOPPED;
        //emit a TunerStoppedEvent
        RuntimeContext.getCurrentApplication().broadcastEvent(new TunerStoppedEvent());
      },
      stopCurrentChannel: function stopCurrentChannel () {
        this._removeBroadcastVideoTag();
      },
      _getUrlParameter: function _getUrlParameter (name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(document.location.search);
        return results === null ? '' : results[1].replace(/\+/g, ' ');
      },
      getCurrentChannelName: function getCurrentChannelName () {
        //for this source the parameter channel contains the value that can be mapped to actual channel name
        return this._getUrlParameter("channel");
      },
      getChannelNameList : function (params) {
        // not implemented/supported
      },
      setPosition : function(top, left, width, height) {
        this._videoTag.style.top = top + 'px';
        this._videoTag.style.left = left + 'px';
        this._videoTag.style.width = width + 'px';
        this._videoTag.style.height = height + 'px';
      },
      getState : function() {
        var state = BaseTvSource.STATE.UNKNOWN;
        var playState = this.playState;
        if (playState === this._playStates.UNREALIZED){
          state = BaseTvSource.STATE.UNAVAILABLE;
        } else if (playState === this._playStates.CONNECTING){
          state = BaseTvSource.STATE.CONNECTING;
        } else if (playState === this._playStates.PRESENTING){
          state = BaseTvSource.STATE.PRESENTING;
        }
        return state;
      },
      destroy : function() {
        // not implemented/supported
      }

    });

    Device.prototype.isBroadcastSourceSupported = function() {
      return RuntimeContext.getCurrentApplication().hasBroadcastOrigin();
    };

    /**
    * Create a broadcastSource object on the Device to be
    * accessed as a singleton to avoid the init being run
    * multiple times
    */
    Device.prototype.createBroadcastSource = function() {
      if (!this._broadcastSource) {
        this._broadcastSource = new AstraSource();
      }

      return this._broadcastSource;
    };

    // Return the AstraSource object for testing purposes
    return AstraSource;
  }
);
