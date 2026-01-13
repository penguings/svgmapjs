# GitHub Copilot 指示書（svgmapjs / fork）

このリポジトリは https://github.com/svgmap/svgmapjs.git のフォークです。svgmap（公式）への敬意を前提に、公式ドキュメント/公式デモへのリンクは参照先として尊重し、否定的な表現は避けてください。

## このリポジトリの前提

- ESM 前提（package.json の `type: module`）。`require()` は基本使わず `import/export` を使う。
- ブラウザ実行前提のコードが多い（DOM/Window/Storage 等）。Node だけで動かす前提でのリファクタはしない。
- インデントはタブ、セミコロンありの既存スタイルに合わせる（`.prettierrc` / README の `prettier --use-tabs`）。
- ライセンスは MPL-2.0。既存ファイル先頭のライセンス表記は削除しない。

## 変更の方針（大きめの機能追加OK）

- 機能追加/改善提案は歓迎。ただし既存の設計・命名・API 形状を優先し、無関係な整理（大規模リネーム、整形だけの変更、無差別なコメント書き換え）は避ける。
- 破壊的変更は許容するが、必ず「Breaking change」として明示し、移行方法/影響範囲をドキュメントに残す（後述）。

## ビルド/生成物

- `npm run build` は rollup により `dist/` 配下を生成/更新する。
- 生成物の手編集はしない。差分が必要なら入力側を直し、必ず `npm run build` を実行して生成物を更新する。

## テスト

- ユニットテスト: `npm test`
  - Windows の PowerShell/cmd では `NODE_OPTIONS=...` の指定方法により動かない場合がある。必要なら WSL2/Git Bash を使うか、PowerShell で環境変数を設定してから実行する。
- E2E: `npm run e2e`
  - ネットワーク（外部サイト）に依存するテストがあるため、失敗時にコード断定はしない。
  - Playwright の WebKit は環境によっては導入できない場合がある（README の注意を参照）。

## ドキュメント（重要）

### 方針

- API 仕様書は GitHub Pages（latest のみ）を正とする。
- GitHub Wiki は利用しない（新規に追記しない）。
- 過去版の仕様は「過去の tag の docs を参照」する運用とし、Pages 側で過去版を保持しない。

### 何を更新するか

- 公開 API/使い方/互換性に影響する変更を入れたら、同じ PR 内で必ず docs も更新する。
  - 新機能: 使用例/ガイド、必要なら API リファレンス（JSDoc）
  - 破壊的変更: README と互換性ノート（例: `docs/compat.md`）に「Breaking change」「影響範囲」「移行方法」を追記

### API リファレンス生成

- API リファレンスは JSDoc から生成する。
  - 生成コマンド: `npm run docs:api`
  - 出力先: `docs/api/`（生成物は git 管理しない / `.gitignore` で除外）
  - 公開: GitHub Actions で生成して Pages にデプロイ（リポジトリ設定で Pages の Source を GitHub Actions にする）

### JSDoc コメントの扱い

- `@Parameters` / `@Returns` のような非標準タグが混在している。
  - リポジトリ全体の一括置換はしない。
  - 近傍を触る必要があるときだけ最小限に修正し、ファイル内の既存流儀を優先する。

## 公式（svgmap）への言及/リンク

- 公式（svgmap.org / 公式 GitHub / 公式デモ）は参照先として尊重して残す。
- 公式とこの fork の導線は区別して書く（例: “official” と “this fork” を明記）。
- 公式の誤りを示唆するような強い断定は避け、用途に応じた使い分けとして説明する。
