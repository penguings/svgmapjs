# 互換性ノート（Breaking changes）

このファイルは、この fork における破壊的変更（Breaking change）の一覧・影響範囲・移行手順を記録します。

## 書き方

- 破壊的変更が入った PR では、必ず同じ PR 内でここも更新してください。
- 1項目につき、最低限「影響範囲」「移行手順（before/afterの説明）」を含めてください。

## 変更履歴

### Unreleased

- **Breaking change**: コア `SvgMap` は標準拡張（LayerUI / Authoring / CustomLayersManager / Cesium 等）を自動で導入しません。
	- 影響範囲: `new SvgMap()` や `SVGMapLv0.1_r18module.js` の `svgMap` を利用していたアプリで、レイヤーUIやオーサリング機能等が起動しなくなります。
	- 移行手順:
		- 必要な拡張を明示的に `plugins` 経由で導入してください。
		- 例: `import { SvgMap, SvgMapAuthoringPlugin, SvgMapLayerUIPlugin, SvgMapCustomLayersManagerPlugin, SvgMapCesiumPlugin } from "@penguings/svgmapjs"; const map = new SvgMap({ plugins: [SvgMapAuthoringPlugin, SvgMapLayerUIPlugin, SvgMapCustomLayersManagerPlugin, SvgMapCesiumPlugin] });`

- **Breaking change**: リポジトリ root 直下の旧エントリポイント/互換 shim（例: `SVGMapLv0.1_*.js`、`InterWindowMessaging.js`、`CorsProxyModule.js`、`SVGMapCustomLayersManager_*`、`libs/`、`3D_extension/`、`svgMapLayerLib.js`）を削除しました。
	- 影響範囲: `./SVGMapLv0.1_Class_r18module.js` や `./libs/ZoomPanManager.js` のように root 相対パスで import していたコードが動かなくなります。
	- 移行手順:
		- コア: `@penguings/svgmapjs` から import してください。
		- 拡張: 利用機能に応じて `@penguings/svgmapjs-gis` / `@penguings/svgmapjs-layer-ui` / `@penguings/svgmapjs-authoring` / `@penguings/svgmapjs-custom-layers-manager` / `@penguings/svgmapjs-cesium` を import してください。
		- Cesium の HTML/補助モジュールを直接参照していた場合は、`packages/extensions/cesium/src/3D_extension/` 配下へ参照先を更新してください（配布形態に応じて自前で静的配信する構成にしてください）。

- **Breaking change**: LayerSpecificWebAppHandler は core 側（`@penguings/svgmapjs`）に同梱され、互換用の `@penguings/svgmapjs-layer-specific-webapp-handler` パッケージは削除しました。
	- 影響範囲: `@penguings/svgmapjs-layer-specific-webapp-handler` から import していたコードが動かなくなります。
	- 移行手順:
		- `import { SvgMapLayerSpecificWebAppHandlerPlugin } from "@penguings/svgmapjs";` を利用してください。
		- 以前暗黙に iframe へ注入されていた `svgMapGIStool` が必要な場合は、`options.gisTool` として注入してください（例: `import { SvgMapGIS } from "@penguings/svgmapjs-gis"; const gisTool = new SvgMapGIS(map, window.jsts);`）。
