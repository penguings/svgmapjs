import { SvgMapCustomLayersManager } from "../../../../SVGMapLv0.1_CustomLayersManager_r3module.js";

export { SvgMapCustomLayersManager };

export const SvgMapCustomLayersManagerPlugin = {
	name: "custom-layers-manager",
	install(svgMap, options, api) {
		const layerUI = options.layerUI || api.getExtension("layerUI");
		if (!layerUI) {
			throw new Error(
				"SvgMapCustomLayersManagerPlugin: layerUI が必要です（SvgMapLayerUIPlugin を先に導入してください）",
			);
		}
		const svgMapCustomLayersManager = new SvgMapCustomLayersManager(
			svgMap,
			layerUI.getLayersCustomizer,
		);
		api.setCustomLayersManager(svgMapCustomLayersManager);
		api.setExtension("customLayersManager", svgMapCustomLayersManager);
	},
};
