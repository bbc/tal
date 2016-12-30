define(
    'antie/devices/anim/css3transform/transition',
    [
        'antie/devices/anim/shared/helpers',
        'antie/devices/anim/css3/easinglookup'
    ],
    function (Helpers, EasingLookup) {
      'use strict';

      function set (el, property, options) {
        var durationMs = options.duration || 840;
        var easing = options.easing || 'easeFromTo';
        var easingFormula = new EasingLookup()[easing];

        var transition = property + ' ' + durationMs + 'ms ' + easingFormula;
        Helpers.setStyle(el, 'transition', transition, true);
      }

      function clear (el) {
        Helpers.setStyle(el, 'transition', '', true);
      }

      return {
        set: set,
        clear: clear
      }
    }
);