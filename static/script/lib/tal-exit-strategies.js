define('antie/lib/tal-exit-strategies', function () {

function closeWindow () {
  window.close();
}

function openCloseWindow () {
  window.open('', '_self');
  window.close();
}

function destroyApplication () {
  if (window.oipfObjectFactory.isObjectSupported('application/oipfApplicationManager')) {
    window.oipfObjectFactory
      .createApplicationManagerObject()
      .getOwnerApplication(window.document)
      .destroyApplication();
  }
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

var modifierMap = {
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

function getStrategyForConfig (config) {
  config = config || {};

  var modifier = (config.modifiers || []).reduce(function (m, c) {
    return c.indexOf('exit') > -1 ? c : m
  }, '');

  return modifierMap[modifier]
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

});
