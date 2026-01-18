import { SvgMapCesiumWrapper } from "./3D_extension/SVGMapLv0.1_CesiumWrapper_r4module.js";

export { SvgMapCesiumWrapper };

export const SvgMapCesiumPlugin = {
	name: "cesium",
	install(svgMap, options, api) {
		const svgMapCesiumWrapper = new SvgMapCesiumWrapper(svgMap);
		api.setCesiumWrapper(svgMapCesiumWrapper);
		api.setExtension("cesiumWrapper", svgMapCesiumWrapper);
	},
};
