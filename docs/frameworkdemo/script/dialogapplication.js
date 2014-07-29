/**
 * Created by IntelliJ IDEA.
 * User: chris
 * Date: 04/10/2011
 * Time: 14:29
 * To change this template use File | Settings | File Templates.
 */
require.def("frameworkdemo/dialogapplication",
		[
			"antie/application",
			"antie/widgets/container"
		],
		function (FrameworkApplication, Container) {
			return FrameworkApplication.extend({
				run: function() {
					var rootContainer = new Container();

				    this.setRootWidget(rootContainer);

					var dialogContainer = this.addComponentContainer("dialogcontainer",
							"frameworkdemo/appui/components/dialog");

					var self = this;
					dialogContainer.addEventListener("aftershow",
							function(ev) {
								self.setActiveComponent(dialogContainer.id);
								self.ready();
							});
				}
			})
		}
)
