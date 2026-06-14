# SVGMap.js (this fork)

SVGMap は SVG をベースにした Web マッピングフレームワークです。従来の地図フレームワークとは異なる、疎結合で分散型の Web マッピング構成を取りやすく、通常のベクタタイルを超える高度なタイル機構で大規模な WebGIS を構築できます。

このリポジトリは、official の SVGMap を尊重しつつ、モジュール化と plugin API を中心に拡張している this fork です。標準化活動は W3C で進められています。

## 参照先

- [HomePage (official)](https://svgmap.org/)
- [API Docs (official)](https://www.svgmap.org/wiki/index.php?title=%E8%A7%A3%E8%AA%AC%E6%9B%B8)
- [API Docs (this fork / GitHub Pages)](https://penguings.github.io/svgmapjs/api/)
- [demo (official)](https://svgmap.org/devinfo/devkddi/lvl0.1/demos/demo0.html)
- [demo (official / GitHub Pages)](https://svgmap.github.io/svgMapDemo/) [(source)](https://github.com/svgmap/svgMapDemo)
- [demo (this fork / GitHub Pages)](https://penguings.github.io/svgmapjs/)

## 重要な互換性注意

this fork の現行パッケージでは、コア `SvgMap` は標準拡張を自動導入しません。Layer UI、Authoring、Custom Layers Manager、Cesium などを使う場合は、必要な plugin を明示的に導入してください。

破壊的変更の詳細と移行手順は [docs/compat.md](docs/compat.md) を参照してください。

## 使い始める

このリポジトリには、SVGMapLv0.1 を置き換えるモジュール化版 SVGMap.js が含まれています。開発は 2022 年 5 月に SVGMapLv0.1_r18module.js として始まり、現在は packages ベースの構成と plugin API が this fork の中心です。

### npm packages を使う

core は [packages/svgmap](packages/svgmap) の `@penguings/svgmapjs`、拡張は `@penguings/svgmapjs-*` として分割されています。

- `@penguings/svgmapjs`
- `@penguings/svgmapjs-gis`
- `@penguings/svgmapjs-layer-ui`
- `@penguings/svgmapjs-authoring`
- `@penguings/svgmapjs-custom-layers-manager`
- `@penguings/svgmapjs-cesium`

最小の初期化例:

```js
import {
  SvgMap,
  SvgMapAuthoringPlugin,
  SvgMapLayerUIPlugin,
  SvgMapCustomLayersManagerPlugin,
  SvgMapCesiumPlugin,
} from "@penguings/svgmapjs";

const svgMap = new SvgMap({
  plugins: [
    SvgMapAuthoringPlugin,
    SvgMapLayerUIPlugin,
    SvgMapCustomLayersManagerPlugin,
    SvgMapCesiumPlugin,
  ],
});
```

`new SvgMap({ plugins: [...] })` のほか、`svgMap.use(plugin, options?)` による拡張導入も想定しています。

JavaScript からルートレイヤー一覧を定義する公開 API も利用できます。

```js
svgMap.setRootLayersDefinition([
  { title: "Base", href: "base.svg#globe", visible: true },
  { title: "Overlay", href: "overlay.svg#globe", visible: false },
]);
```

### ブラウザから module import する

official のモジュラー版ドキュメントは引き続き参照できます。旧来のブラウザ直 import を使う場合は、利用する entry point と互換性注意を [docs/compat.md](docs/compat.md) と合わせて確認してください。

```html
<script type="text/javascript" src="https://unpkg.com/jsts@1.6.1/dist/jsts.min.js"></script>
<script type="module">
  import { svgMap } from "https://cdn.jsdelivr.net/gh/svgmap/svgmapjs@latest/SVGMapLv0.1_r18module.js";
  window.svgMap = svgMap;
</script>
```

詳細は [official documentation](https://www.svgmap.org/wiki/index.php?title=%E8%A7%A3%E8%AA%AC%E6%9B%B8#rev18_.28ECMA_Script_Module.E7.89.88.29.E3.81.AE.E4.BE.8B) を参照してください。

## ドキュメント

this fork では、JSDoc から生成した最新の API リファレンスを GitHub Pages で公開しています。

- API リファレンス: https://penguings.github.io/svgmapjs/api/
- ローカル生成: `npm run docs:api`

過去バージョンの仕様は、各 tag に含まれる docs を参照してください。

## 開発

### ブランチ方針

コントリビューション用の pull request は `dev*` ブランチ向けのみ受け付けます。

### セットアップ

このリポジトリは npm workspaces を使います。

```bash
npm install
```

WSL2 (Ubuntu 24.04) での動作確認実績があります。PowerShell でも `npm test` は [package.json](package.json) の `cross-env` 設定でそのまま実行できます。

Node.js の導入方法は任意ですが、LTS の利用を推奨します。`n` を使う場合の例:

```bash
sudo npm install -g n
sudo n lts
```

### ビルド

パッケージの dist エントリファイルと bundle 済み ESM ビルドを生成または更新します。

```bash
npm run build
```

生成物:

- `packages/*/dist/*.js`: workspace package 用の export proxy
- `packages/svgmap/dist/svgmapjs.esm.js`: ブラウザ向け bundle 済み ESM ビルド

`dist/` 配下は直接編集せず、ソース修正後に再ビルドしてください。

### テスト

ユニットテスト:

```bash
npm test
```

E2E テスト:

```bash
npm run e2e
```

Playwright のセットアップ:

```bash
npx playwright install
sudo npx playwright install-deps
```

補足:

- WSL2 (Ubuntu 24.04) で動作確認しています。
- Ubuntu 22.04 では Safari (WebKit) を導入できない場合があります。
- E2E テストは外部サイトへのネットワーク依存を含みます。
- VS Code の Playwright Test 拡張は任意です。

### API ドキュメント生成

```bash
npm run docs:api
```

### コード整形

```bash
prettier --use-tabs "$F"
```

## ライセンス

このプロジェクトのライセンスは MPL-2.0 です。詳細は [LICENSE](LICENSE) と [MPL 2.0](https://www.mozilla.org/en-US/MPL/2.0/) を参照してください。