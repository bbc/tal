require.def('antie/devices/media/samsung_maple_unload',
    [
      'antie/devices/media/samsung_maple'
    ],
    function(SamsungMaple) {

      return SamsungMaple.extend({
        addExitStrategyEventListener: function() {
          var self = this;
          window.addEventListener('unload', function () {
            self.playerPlugin.Stop();
            self.tvmwPlugin.SetSource(self.originalSource);
          }, false);
        }
      });
    }
);
