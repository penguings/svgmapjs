import { LayerSpecificWebAppHandler } from "../../../../libs/LayerSpecificWebAppHandler.js";

export { LayerSpecificWebAppHandler };

export const SvgMapLayerSpecificWebAppHandlerPlugin = {
	name: "layer-specific-webapp-handler",
	install(svgMap, options, api) {
		const authoringTool =
			options.authoringTool || api.getExtension("authoringTool") || null;
		const layerSpecificWebAppHandler = new LayerSpecificWebAppHandler(
			svgMap,
			authoringTool,
			api.getLayerStatus,
		);
		api.setLayerSpecificWebAppHandler(layerSpecificWebAppHandler);
		api.setExtension(
			"layerSpecificWebAppHandler",
			layerSpecificWebAppHandler,
		);
	},
};
