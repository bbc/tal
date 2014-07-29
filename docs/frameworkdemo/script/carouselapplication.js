/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: 05/10/2011
 * Time: 11:22
 * To change this template use File | Settings | File Templates. 
 */

require.def("frameworkdemo/carouselapplication",
		[
			"antie/application",
			"antie/widgets/container",
			"antie/mediasource",
			"antie/events/keyevent"
		],
		function (FrameworkApplication, Container, MediaSource, KeyEvent) {
			return FrameworkApplication.extend({
				run: function() {
					var rootContainer = new Container();

					this.setRootWidget(rootContainer);

					this._carouselContainer = this.addComponentContainer("carouselcontainer",
							"frameworkdemo/appui/components/videocarousel");
					
					this._videoPlayer = this.getDevice().createPlayer("testPlayer", "video");
					rootContainer.appendChildWidget(this._videoPlayer);
					this._navHidden = true;

					var self = this;
					this._videoPlayer.addEventListener("canplay", function(ev) { self._onCanPlay(ev); });
					this._videoPlayer.addEventListener("ended", function(ev) { self._onEnded(ev); });
					this._carouselContainer.addEventListener("beforeshow", function(ev) { self._onBeforeShow(ev); });
					this._carouselContainer.addEventListener("aftershow", function(ev) { self._onAfterShow(ev); });
					this._carouselContainer.addEventListener("select", function(ev) { self._onSelect(ev); });
					this.addEventListener("keydown", function(ev) { self._onKeyDown(ev); });
					
					/* Example logging levels and how to use them */
					var logger = this.getDevice().getLogger();
					logger.log("Default Log Message");
					logger.debug("Debug Message");
					logger.info("Info Message");
					logger.error("Error Message");
					logger.warn("Warn Message");
				},
				_hideCarousel: function() {
					if(!this._navHidden) {
						var device = this.getDevice();
						var screenHeight = device.getElementSize(this.getRootWidget().outputElement).height;
						device.moveElementTo(this._carouselContainer.outputElement, null, screenHeight - 65);
						device.showElement({
							el: this._carouselContainer.outputElement,
							skipAnim: true
						});
						this._navHidden = true;
					}
				},
				_showCarousel: function(skipAnimation) {
					if(this._navHidden) {
						var device = this.getDevice();
						var screenHeight = device.getElementSize(this.getRootWidget().outputElement).height;
						var componentHeight = device.getElementSize(this._carouselContainer.outputElement).height;
						if (screenHeight == 0){
							screenHeight = 540;
						}
						 device.moveElementTo(this._carouselContainer.outputElement, null, (screenHeight - componentHeight) / 2, skipAnimation);
						this._navHidden = false;
					}
				},
				_onKeyDown: function(ev) {
					if(ev.keyCode == KeyEvent.VK_DOWN) {
						this._showCarousel();
					}
				},
				_onCanPlay: function(ev) {
					this._videoPlayer.play();
				},
				_onEnded: function(ev) {
					var device = this.getDevice();
					device.removeClassFromElement(document.body, "playing");
					this._showCarousel();
				},
				_onBeforeShow: function(ev) {
					this._showCarousel(true);
				},
				_onAfterShow: function(ev) {
					this.setActiveComponent(ev.container.id);
					this.ready();
				},
				_onSelect: function(ev) {
					var item = ev.target.getDataItem();
					var device = this.getDevice();
					device.addClassToElement(document.body, "playing");
					this._videoPlayer.setSources([new MediaSource(item.mediaUrl, item.mediaType)]);
					this._videoPlayer.load();
					this._hideCarousel();
				},
				destroy: function() {
					this._videoPlayer.stop();
					this._super();
				}
			})
		})
