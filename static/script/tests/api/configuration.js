var ConfigurationApi = {
	override : function(json) {
		ConfigurationApi._override_json(antie.framework.deviceConfiguration, json);
		return true;
	},

	_override_json : function(original, patch) {
		for (key in patch) {
			if (typeof(original[key]) == "object" && typeof(patch[key]) == "object"){
				ConfigurationApi._override_json(original[key], patch[key]);
			}
			else {
				original[key] = patch[key];
			}
		}
	}
};
