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
		- 例: `import { SvgMap, SvgMapDefaultExtensionsPlugin } from "@penguings/svgmapjs"; const map = new SvgMap({ plugins: [SvgMapDefaultExtensionsPlugin] });`
