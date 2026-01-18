import { SvgMapAuthoringTool } from "./SVGMapLv0.1_Authoring_r8_module.js";

export { SvgMapAuthoringTool };

export const SvgMapAuthoringPlugin = {
	name: "authoring",
	install(svgMap, options, api) {
		const svgMapAuthoringTool = new SvgMapAuthoringTool(
			svgMap,
			api.core.mapViewerProps,
		);
		api.setAuthoringTool(svgMapAuthoringTool);
		api.setExtension("authoringTool", svgMapAuthoringTool);
	},
};
