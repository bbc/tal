require.def('antie/devices/media/samsung_maple_unload',
    [
      'antie/devices/media/samsung_maple'
    ],
    function(SamsungMaplePlayer) {
      'use strict';

      SamsungMaplePlayer.prototype._addExitStrategyEventListener = function() {
          var self = this;
          window.addEventListener('unload', function () {
            self.playerPlugin.Stop();
            self.tvmwPlugin.SetSource(self.originalSource);
          }, false);
        };

        return SamsungMaplePlayer;
    }
);
