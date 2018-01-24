(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.TALExitStrategies = factory());
}(this, (function () { 'use strict';

function closeWindow () {
  window.close();
}

function openCloseWindow () {
  window.open('', '_self');
  window.close();
}

function destroyApplication () {
  try {
    var factory = window.oipfObjectFactory;
    if (factory.isObjectSupported('application/oipfApplicationManager')) {
      factory
        .createApplicationManagerObject()
        .getOwnerApplication(window.document)
        .destroyApplication();
    }
  } catch (e) {}
}

function history () {
  window.history.go(-(window.history.length - 1));
}

function netcast () {
  window.NetCastBack();
}

function sagemcom () {
  window.parent.postMessage('JS_EVENT_QUIT_THIRD_PARTY', '*');
}

function samsungMaple () {
  new window.Common.API.Widget().sendReturnEvent();
}

function samsungTizen () {
  window.tizen.application.getCurrentApplication().exit();
}

function tivoCore () {
  window.tivo.core.exit();
}

function netcastBroadcast () {
  window.NetCastExit();
}

function samsungMapleBroadcast () {
  new window.Common.API.Widget().sendExitEvent();
}

var MAP = {
  'antie/devices/exit/closewindow': closeWindow,
  'antie/devices/exit/destroyapplication': destroyApplication,
  'antie/devices/exit/history': history,
  'antie/devices/exit/netcast': netcast,
  'antie/devices/exit/openclosewindow': openCloseWindow,
  'antie/devices/exit/sagemcom': sagemcom,
  'antie/devices/exit/samsung_maple': samsungMaple,
  'antie/devices/exit/samsung_tizen': samsungTizen,
  'antie/devices/exit/tivo': tivoCore,
  'antie/devices/exit/broadcast/netcast': netcastBroadcast,
  'antie/devices/exit/broadcast/samsung_maple': samsungMapleBroadcast
};

function getStrategyForConfig (deviceConfig, options) {
  options = options || {};

  var modifiers = deviceConfig.modules.modifiers;
  var exitModifiers = modifiers.filter(function (m) { return m.match(/exit\//) });

  if (!exitModifiers.length) return
  if (exitModifiers.length === 1) return MAP[exitModifiers[0]]

  var matcher = options.exitToBroadcast ? /exit\/broadcast/ : /exit\/(?!broadcast)/;
  var modifier = exitModifiers.filter(function (m) { return m.match(matcher) })[0];

  return MAP[modifier || exitModifiers[0]]
}

var index = {
  getStrategyForConfig: getStrategyForConfig,
  closeWindow: closeWindow,
  openCloseWindow: openCloseWindow,
  destroyApplication: destroyApplication,
  history: history,
  netcast: netcast,
  sagemcom: sagemcom,
  samsungMaple: samsungMaple,
  samsungTizen: samsungTizen,
  tivoCore: tivoCore,
  netcastBroadcast: netcastBroadcast,
  samsungMapleBroadcast: samsungMapleBroadcast
}

return index;

})));
