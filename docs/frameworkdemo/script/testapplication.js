require.def("frameworkdemo/testapplication",
	[
		"antie/application",
		"antie/widgets/container",
		"antie/mediasource"
	],
	function(FrameworkApplication, Container, MediaSource) {

		return FrameworkApplication.extend({
			run: function() {
				var rootContainer = new Container();
				this.setRootWidget(rootContainer);

				var videoPlayer = this.getDevice().createPlayer("testPlayer", "video");
				rootContainer.appendChildWidget(videoPlayer);

				videoPlayer.addEventListener("canplay", function() {
					videoPlayer.play();
				});
				videoPlayer.setSources([new MediaSource("http://downloads.bbc.co.uk/iplayer/idcp/BR_HD_Barker_H264_TV1500_high32_2passVBR_2.mp4", "video/mp4")]);
				videoPlayer.load();

				this.ready();
			}
		});
	}
);
