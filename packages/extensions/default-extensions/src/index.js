import { SvgMapAuthoringPlugin } from "../authoring/src/index.js";
import { SvgMapLayerSpecificWebAppHandlerPlugin } from "../layer-specific-webapp-handler/src/index.js";
import { SvgMapLayerUIPlugin } from "../layer-ui/src/index.js";
import { SvgMapCustomLayersManagerPlugin } from "../custom-layers-manager/src/index.js";
import { SvgMapCesiumPlugin } from "../cesium/src/index.js";

export const SvgMapDefaultExtensionsPlugin = {
	name: "default-extensions",
	install(svgMap) {
		svgMap.use(SvgMapAuthoringPlugin);
		svgMap.use(SvgMapLayerSpecificWebAppHandlerPlugin);
		svgMap.use(SvgMapLayerUIPlugin);
		svgMap.use(SvgMapCustomLayersManagerPlugin);
		svgMap.use(SvgMapCesiumPlugin);
	},
};
