# Monorepo / packages 設計メモ（this fork）

このリポジトリは将来的に、core と extensions を別 npm パッケージとして分割するために `packages/` 配下にソースを集約します。

## 目的

- core（地図エンジン本体）と extensions（LayerUI/GIS/Authoring/CustomLayersManager/3D等）を分離し、依存関係を整理する
- npm パッケージとして個別に配布できる形にする
- 既存のブラウザ直 import（root 直下の ESM ファイル）を当面壊さず段階移行する

## 重要方針

- core は extensions を直 import しない（最終形）
- extensions 側が core に対して登録/注入する形（plugin 方式）を目指す
- 既存の root 直下ファイルは互換のため残し、最終的に `packages/` 側へ委譲する（Breaking change を避けたい期間）

## 現状（移行の足場）

- `packages/svgmap/` : core パッケージ（現時点は root ファイルを re-export するだけの scaffold）
- `packages/extensions/*` : extension パッケージ（現時点は root ファイルを re-export するだけの scaffold）

## 次ステップ案

1. core ソース（SvgMap + libs）を `packages/svgmap/src/` に移動し、root 側は re-export に置き換える
2. core から extension import を外し、plugin registry を導入する（plugin API は `new SvgMap({ plugins: [...] })` / `svgMap.use(plugin)`）
3. extensions を `packages/extensions/*/src/` に移動し、依存を `@penguings/svgmapjs` に統一する
4. 配布（dist/Pages）向けに、ブラウザ直 import 可能な成果物（bundle）も整備する

## Plugin API（決定）

- `new SvgMap(options)`
	- 標準拡張は自動導入しない（必要な場合は明示プラグインで導入する）
	- `options.plugins` に配列を渡すとプラグインをインストールする
- `svgMap.use(plugin, options?)`
	- `plugin` は `{ name, install(svgMap, options, api) }` を基本形とする（関数も可）
	- `api` は core 参照と、拡張を設定するための setter（`setLayerUI` 等）を提供する
	- `api.onInitLoad(fn)` で window load 後のフックを登録できる

## ドキュメント運用

- latest の仕様は GitHub Pages を正とする
- 旧版は tag の `docs/` を参照する
