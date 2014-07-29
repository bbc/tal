/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: 05/10/2011
 * Time: 11:34
 * To change this template use File | Settings | File Templates.
 */
require.def("frameworkdemo/appui/components/videocarousel",
		[
				"antie/widgets/component",
				"antie/widgets/horizontalcarousel",
				"antie/datasource",
				"frameworkdemo/datasources/videofeed",
				"frameworkdemo/appui/formatters/pagingformatter",
				"frameworkdemo/appui/formatters/videocarouselitemformatter",
				"frameworkdemo/appui/formatters/videocarouselitemformatterlarge",
				"frameworkdemo/appui/formatters/onetwoformatter"
		],
		function(Component, HorizontalCarousel, DataSource, VideoFeed, PagingFormatter, VideoCarouselItemFormatter, VideoCarouselItemFormatterLarge, OneTwoFormatter) {
			  return Component.extend({
				  init : function() {
					  this._super("videocarouselcomponent");
					  var formatter = new PagingFormatter(new OneTwoFormatter(new VideoCarouselItemFormatterLarge(), new VideoCarouselItemFormatter()), 4);
					  var carousel = new HorizontalCarousel("videocarousel", formatter);
					  carousel.setWrapMode(HorizontalCarousel.WRAP_MODE_NONE);
					  var videoFeedUrl = this.getCurrentApplication().getDevice().getConfig();
					  // Instead of adding individual items,
					  // we'll use a DataSource
					  var self = this;
					  this.addEventListener("beforerender",
							  function(ev) {
								  var videoFeed = new VideoFeed();
								  var dataSource = new DataSource(self, videoFeed, "loadData");
								  carousel.setDataSource(dataSource);
							  });
					  this.appendChildWidget(carousel);
				  }
			  })
		})