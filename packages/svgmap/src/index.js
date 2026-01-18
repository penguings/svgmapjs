import { LayerSpecificWebAppHandler } from "./libs/LayerSpecificWebAppHandler.js";

export { SvgMap } from "./SVGMapLv0.1_Class_r18module.js";

export * from "./InterWindowMessaging.js";

export * from "./libs/BuiltinIcons.js";
export * from "./libs/CollidedImagesGetter.js";
export * from "./libs/CustomHitTester.js";
export * from "./libs/CustomModal.js";
export * from "./libs/EssentialUIs.js";
export * from "./libs/GPS.js";
export * from "./libs/GeometryCapture.js";
export * from "./libs/GlobalMessageDisplay.js";
export * from "./libs/HashGen.js";
export * from "./libs/ImgRenderer.js";
export * from "./libs/LayerManager.js";
export * from "./libs/LayerStyleCustomizer.js";
export * from "./libs/LinkedDocOp.js";
export * from "./libs/MapTicker.js";
export * from "./libs/MapViewerProps.js";
export * from "./libs/PathHitTester.js";
export * from "./libs/PathRenderer.js";
export * from "./libs/PoiHitTester.js";
export * from "./libs/ProxyManager.js";
export * from "./libs/CorsProxyModule.js";
export * from "./libs/ResourceLoadingObserver.js";
export * from "./libs/ResumeManager.js";
export * from "./libs/LayerSpecificWebAppHandler.js";
export * from "./libs/ShowPoiProperty.js";
export * from "./libs/SvgImageProps.js";
export * from "./libs/SvgMapElementType.js";
export * from "./libs/SvgStyle.js";
export * from "./libs/TernarySimultaneousEquationsSolution.js";
export * from "./libs/TransformLib.js";
export * from "./libs/UAtester.js";
export * from "./libs/UtilFuncs.js";
export * from "./libs/ZoomPanManager.js";

export const SvgMapLayerSpecificWebAppHandlerPlugin = {
	name: "layer-specific-webapp-handler",
	install(svgMap, options, api) {
		const authoringTool =
			options.authoringTool || api.getExtension("authoringTool") || null;
		const layerSpecificWebAppHandler = new LayerSpecificWebAppHandler(
			svgMap,
			authoringTool,
			api.getLayerStatus,
			options.gisTool || null,
		);
		api.setLayerSpecificWebAppHandler(layerSpecificWebAppHandler);
		api.setExtension("layerSpecificWebAppHandler", layerSpecificWebAppHandler);
	},
};
