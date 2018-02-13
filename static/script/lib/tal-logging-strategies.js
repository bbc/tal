define('antie/lib/tal-logging-strategies', function () { 'use strict';

function log () {
  window.alert('[LOG] ' + Array.prototype.join.call(arguments, '\n'));
}

function debug () {
  window.alert('[DEBUG] ' + Array.prototype.join.call(arguments, '\n'));
}

function info () {
  window.alert('[INFO] ' + Array.prototype.join.call(arguments, '\n'));
}

function warn () {
  window.alert('[WARN] ' + Array.prototype.join.call(arguments, '\n'));
}

function error () {
  window.alert('[ERROR] ' + Array.prototype.join.call(arguments, '\n'));
}

var alert = {
  log: log,
  debug: debug,
  info: info,
  warn: warn,
  error: error
};

function noop () {}

var noop_1 = {
  log: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop
};

function log$1 () {
  console.log('[LOG]', Array.prototype.join.call(arguments, '\n'));
}

function debug$1 () {
  console.log('[DEBUG]', Array.prototype.join.call(arguments, '\n'));
}

function info$1 () {
  console.log('[INFO]', Array.prototype.join.call(arguments, '\n'));
}

function warn$1 () {
  console.log('[WARN]', Array.prototype.join.call(arguments, '\n'));
}

function error$1 () {
  console.log('[ERROR]', Array.prototype.join.call(arguments, '\n'));
}

var console_1 = {
  log: log$1,
  debug: debug$1,
  info: info$1,
  warn: warn$1,
  error: error$1
};

/* global jstestdriver */

function log$2 () {
  jstestdriver.console.log(Array.prototype.join.call(arguments, '\n'));
}

function debug$2 () {
  jstestdriver.console.debug(Array.prototype.join.call(arguments, '\n'));
}

function info$2 () {
  jstestdriver.console.info(Array.prototype.join.call(arguments, '\n'));
}

function warn$2 () {
  jstestdriver.console.warn(Array.prototype.join.call(arguments, '\n'));
}

function error$2 () {
  jstestdriver.console.error(Array.prototype.join.call(arguments, '\n'));
}

var jstestdriver_1 = {
  log: log$2,
  debug: debug$2,
  info: info$2,
  warn: warn$2,
  error: error$2
};

function getContainer () {
  return document.getElementById('onScreenLogging')
}

function createContainer () {
  var div = document.createElement('div');

  div.id = 'onScreenLogging';
  div.style.zIndex = 9999999;
  div.style.position = 'absolute';
  div.style.top = 0;
  div.style.left = 0;
  div.style.padding = '20px';
  div.style.color = '#000000';
  div.style.lineHeight = '12px';
  div.style.fontSize = '12px';

  // Set a non-rgba colour first in case they're not supported
  div.style.backgroundColor = '#d8d8d8';
  div.style.backgroundColor = 'rgba(216,216,216,0.8)';

  document.body.appendChild(div);

  return div
}

function prependItem (text) {
  var container = getContainer() || createContainer();
  container.innerHTML = text + '<hr />' + container.innerHTML;
}

function log$3 () {
  prependItem('[LOG] ' + Array.prototype.join.call(arguments, ', '));
}

function debug$3 () {
  prependItem('[DEBUG] ' + Array.prototype.join.call(arguments, ', '));
}

function info$3 () {
  prependItem('[INFO] ' + Array.prototype.join.call(arguments, ', '));
}

function warn$3 () {
  prependItem('[WARN] ' + Array.prototype.join.call(arguments, ', '));
}

function error$3 () {
  prependItem('[ERROR] ' + Array.prototype.join.call(arguments, ', '));
}

var onscreen = {
  log: log$3,
  debug: debug$3,
  info: info$3,
  warn: warn$3,
  error: error$3
};

/* global XMLHttpRequest */

function xhrPost (payload) {
  var http = new XMLHttpRequest();
  http.open('POST', '/log', true);
  http.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  http.send(JSON.stringify(payload));
}

function log$4 () {
  xhrPost({
    level: 'log',
    body: Array.prototype.join.call(arguments, '\n')
  });
}

function debug$4 () {
  xhrPost({
    level: 'debug',
    body: Array.prototype.join.call(arguments, '\n')
  });
}

function info$4 () {
  xhrPost({
    level: 'info',
    body: Array.prototype.join.call(arguments, '\n')
  });
}

function warn$4 () {
  xhrPost({
    level: 'warn',
    body: Array.prototype.join.call(arguments, '\n')
  });
}

function error$4 () {
  xhrPost({
    level: 'error',
    body: Array.prototype.join.call(arguments, '\n')
  });
}

var xhr = {
  log: log$4,
  debug: debug$4,
  info: info$4,
  warn: warn$4,
  error: error$4
};

var MAP = {
  'antie/devices/logging/alert': alert,
  'antie/devices/logging/consumelog': noop_1,
  'antie/devices/logging/saving': noop_1,
  'antie/devices/logging/default': console_1,
  'antie/devices/logging/jstestdriver': jstestdriver_1,
  'antie/devices/logging/onscreen': onscreen,
  'antie/devices/logging/xhr': xhr
};

function filterLoggingMethods (strategy, level) {
  var funcs = {
    log: strategy.log,
    error: noop_1.error,
    warn: noop_1.warn,
    info: noop_1.info,
    debug: noop_1.debug
  };

  switch (level) {
    case 'all':
    case 'debug':
      funcs.error = strategy.error;
      funcs.warn = strategy.warn;
      funcs.info = strategy.info;
      funcs.debug = strategy.debug;
      break
    case 'info':
      funcs.error = strategy.error;
      funcs.warn = strategy.warn;
      funcs.info = strategy.info;
      break
    case 'warn':
      funcs.error = strategy.error;
      funcs.warn = strategy.warn;
      break
    case 'error':
      funcs.error = strategy.error;
      break
    default:
      funcs.log = noop_1.log;
  }

  return funcs
}

function getStrategyForConfig (config, options) {
  var logging = config.logging || {};

  var strategy = MAP['antie/devices/logging/' + logging.strategy] || console_1;
  return filterLoggingMethods(strategy, logging.level)
}

var src = {
  getStrategyForConfig: getStrategyForConfig,
  alert: alert,
  noop: noop_1,
  console: console_1,
  jsTestDriver: jstestdriver_1,
  onScreen: onscreen,
  xhr: xhr
};

var talLoggingStrategies = src;

return talLoggingStrategies;

});
