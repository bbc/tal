
/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: 05/10/2011
 * Time: 12:25
 * To change this template use File | Settings | File Templates.
 */
require.def("frameworkdemo/appui/formatters/videocarouselitemformatterlarge",
		[
			"antie/formatter",
		    "antie/widgets/label",
		    "antie/widgets/button",
		    "antie/widgets/image"
		],
		function(Formatter, Label, Button, Image) {
			return Formatter.extend({
				format : function (iterator) {
					var button;
					var item = iterator.next();
					button = new Button("story" + item.id);
					button.setDataItem(item);
					button.appendChildWidget(new Label("large"+item.title));
					button.appendChildWidget(new Image(null, item.image));
					return button;
				}
			})
		})