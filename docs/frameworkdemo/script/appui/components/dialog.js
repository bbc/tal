/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: 04/10/2011
 * Time: 14:52
 * To change this template use File | Settings | File Templates.
 */
require.def("frameworkdemo/appui/components/dialog",
		[
			"antie/widgets/component",
			"antie/widgets/label",
			"antie/widgets/button",
		    "antie/widgets/horizontallist",
		    "antie/widgets/list"
		],
		function (Component, Label, Button, HorizontalList, List) {
			return Component.extend({
				init : function() {
					this._super("dialog");
					var self = this;

					var messageLabel = new Label("messageLabel", "Do you want an OLYMPIC alert?");
					this.appendChildWidget(messageLabel);

					var okButton = new Button("okButton");
					var okButtonText = new Label("okButtonLabel", "ok");
					okButton.appendChildWidget(okButtonText);
					okButton.addEventListener("select",
							function(ev) {
							   alert("OOOOO <- connect them yourself, it's a fun game!");
							});

					var cancelButton = new Button("cancelButton");
					var cancelButtonText = new Label("cancelButtonLabel", "cancel");
					cancelButton.appendChildWidget(cancelButtonText);
					cancelButton.addEventListener("select",
							function(ev) {
							   self.hide();
							});

					var horizontalButtonList = new HorizontalList("dialogButtonList");
					horizontalButtonList.setRenderMode(List.RENDER_MODE_CONTAINER);
					horizontalButtonList.appendChildWidget(okButton);
					horizontalButtonList.appendChildWidget(cancelButton);
					this.appendChildWidget(horizontalButtonList);
				}
			})
		}
)
