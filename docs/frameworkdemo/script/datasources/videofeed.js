/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: 05/10/2011
 * Time: 12:08
 * To change this template use File | Settings | File Templates.
 */
require.def("frameworkdemo/datasources/videofeed",
		[
			"antie/class"
		],
		function(Class) {
			return Class.extend({
				loadData : function(callbacks) {
					// Actually load the data & strip down to get
					// an array of the data
					// If the loading was successful, call the
					// onSuccess callback with the data
					callbacks.onSuccess(
							[
								{
									"id":15167530,
									"title":"1Coe enthusiastic about London 2017 World Champs bid",
									"image":"http://news.bbcimg.co.uk/media/images/55824000/jpg/_55824830_lordcoe041011.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/sport/athletics/786000/786114_h264_512k.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15160182,
									"title":"2HLS samsung example",
									"image":"http://news.bbcimg.co.uk/media/images/55807000/jpg/_55807957_55807896.jpg",
									"mediaUrl":"http://http-live.bbc.co.uk.edgesuite.net/news/newsch/newsch_A_800.m3u8|COMPONENT=HLS",
									"mediaType":"video/mp4"
								},
								{
									"id":15165314,
									"title":"3London 2012: Four British boxers qualify for Olympics",
									"image":"http://news.bbcimg.co.uk/media/images/55734000/jpg/_55734987_144--110118_oda_mda_dp_082_.jpg",
									"mediaUrl":"about:invalidURL.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15159569,
									"title":"4British Olympic Authority undermining Wada - US anti-doping chief",
									"image":"http://news.bbcimg.co.uk/media/images/55802000/jpg/_55802801_travis-tygart-interview.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/sport/olympics_2012/785000/785703_h264_512k.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15154787,
									"title":"5 2012 Olympic athletics track completed",
									"image":"http://news.bbcimg.co.uk/media/images/55796000/jpg/_55796314_55796310.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/news/uk/785000/785617_h264_512k.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15126257,
									"title":"6Shoe salesman Scott Overall turns marathon runner",
									"image":"http://news.bbcimg.co.uk/media/images/55760000/jpg/_55760627_overallvtstill.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/sport/athletics/784000/784808_h264_512k.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15134388,
									"title":"7Chris Hoy starts Olympic track cycling season 'stronger than ever'",
									"image":"http://news.bbcimg.co.uk/media/images/55761000/jpg/_55761970_55761933.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/sport/cycling/784000/784953_h264_512k.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15165314,
									"title":"8London 2012: Four British boxers qualify for Olympics",
									"image":"http://news.bbcimg.co.uk/media/images/55734000/jpg/_55734987_144--110118_oda_mda_dp_082_.jpg",
									"mediaUrl":"about:invalidURL.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15159569,
									"title":"9British Olympic Authority undermining Wada - US anti-doping chief",
									"image":"http://news.bbcimg.co.uk/media/images/55802000/jpg/_55802801_travis-tygart-interview.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/sport/olympics_2012/785000/785703_h264_512k.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15154787,
									"title":"10 2012 Olympic athletics track completed",
									"image":"http://news.bbcimg.co.uk/media/images/55796000/jpg/_55796314_55796310.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/news/uk/785000/785617_h264_512k.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15126257,
									"title":"11 Shoe salesman Scott Overall turns marathon runner",
									"image":"http://news.bbcimg.co.uk/media/images/55760000/jpg/_55760627_overallvtstill.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/sport/athletics/784000/784808_h264_512k.mp4",
									"mediaType":"video/mp4"
								},
								{
									"id":15134388,
									"title":"12 Chris Hoy starts Olympic track cycling season 'stronger than ever'",
									"image":"http://news.bbcimg.co.uk/media/images/55761000/jpg/_55761970_55761933.jpg",
									"mediaUrl":"http://news.downloads.bbc.co.uk.edgesuite.net/mps_h264_400/public/sport/cycling/784000/784953_h264_512k.mp4",
									"mediaType":"video/mp4"
								}
							]
					);
				}
			});
		});
