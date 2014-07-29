/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: 05/10/2011
 * Time: 12:25
 * To change this template use File | Settings | File Templates.
 */
require.def("frameworkdemo/appui/formatters/pagingformatter",
		[
			"antie/formatter",
			"antie/widgets/horizontallist",
		    "antie/widgets/label",
		    "antie/widgets/button",
		    "antie/widgets/image"
		],
		function(Formatter, HorizontalList, Label, Button, Image) {
			return Formatter.extend({

				init : function(singleItemFormatter, totalItems) {
					this.itemFormatter = singleItemFormatter;
					this.totalItems = totalItems;
				},

				format : function (iterator) {
					var horizontalList = new HorizontalList();
					var item;
					for (var i = 0; i < this.totalItems; i++){
						if (iterator.hasNext()){
							item = this.itemFormatter.format(iterator);
							horizontalList.appendChildWidget(item);
						}
					}
					return horizontalList;
				}
			})
		})