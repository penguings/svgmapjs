import { SvgMapLayerUI } from "../../../../SVGMapLv0.1_LayerUI_r6module.js";

export { SvgMapLayerUI };

export const SvgMapLayerUIPlugin = {
	name: "layer-ui",
	install(svgMap, options, api) {
		const layerSpecificWebAppHandler =
			options.layerSpecificWebAppHandler ||
			api.getExtension("layerSpecificWebAppHandler");
		if (!layerSpecificWebAppHandler) {
			throw new Error(
				"SvgMapLayerUIPlugin: layerSpecificWebAppHandler が必要です（SvgMapLayerSpecificWebAppHandlerPlugin を先に導入してください）",
			);
		}
		const svgMapLayerUI = new SvgMapLayerUI(svgMap, layerSpecificWebAppHandler);
		api.setLayerUI(svgMapLayerUI);
		api.setExtension("layerUI", svgMapLayerUI);
		layerSpecificWebAppHandler.setLayerUIobject(svgMapLayerUI);
	},
};
