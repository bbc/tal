/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: 05/10/2011
 * Time: 12:25
 * To change this template use File | Settings | File Templates.
 */
require.def("frameworkdemo/appui/formatters/onetwoformatter",
		[
			"antie/formatter",
			"antie/widgets/list",
			"antie/widgets/verticallist",
		    "antie/widgets/label",
		    "antie/widgets/button",
		    "antie/widgets/image"
		],
		function(Formatter, List, VerticalList, Label, Button, Image) {
			return Formatter.extend({

				init : function(largeFormatter, smallFormatter) {
					this.largeFormatter = largeFormatter;
					this.smallFormatter = smallFormatter;
					this.nextItemLarge = true;
				},

				format : function (iterator) {
					if (this.nextItemLarge){
						this.nextItemLarge = false;
						return this.largeFormatter.format(iterator);
					}
					else {
						this.nextItemLarge = true;
						var verticallist = new VerticalList();
						verticallist.setRenderMode(List.RENDER_MODE_CONTAINER);
						verticallist.appendChildWidget(this.smallFormatter.format(iterator));
						if (iterator.hasNext()){
							verticallist.appendChildWidget(this.smallFormatter.format(iterator));
						}
						return verticallist;
					}
				}
			})
		})