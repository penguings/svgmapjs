# DEVELOPMENT NOTICES

### packages/svgmap/src/InterWindowMessaging.js

History:
2022/08/10 1st rel.
2025/07/02 ホワイトリストで別オリジンからのメッセージを受け取りも可能にする

### packages/svgmap/src/libs/TransformLib.js

History:
2022/08/16 SVGMap.jsから切り出し

### packages/svgmap/src/libs/SvgImageProps.js

History:
2024/10/01 : 連想配列svgImagesProps{}の要素の値SvgImagePropsを無名関数によるオブジェクトではなく、クラス定義をすることにします。

### packages/svgmap/src/libs/LayerSpecificWebAppHandler.js

History:
2023/12-     : SVGMapLayerUIから、レイヤー固有WebApp部を切り離し、コアモジュール直下でインポート (レイヤUIとレイヤ制御の切り離し)

### packages/svgmap/src/assets/svgMapLayerLib.js

History:
2024/07/23 1st implementatiion, to fix https://github.com/svgmap/svgmapjs/issues/5

### packages/extensions/layer-ui/src/SVGMapLv0.1_LayerUI_r6module.js

History:（複数年の履歴が含まれます。主な変更は Rev1〜Rev6 の機能拡張、2023以降の修正）

### packages/extensions/gis/src/SVGMapLv0.1_GIS_r4_module.js

History:
多数のバージョン履歴（2016〜2023）。GeoJSON/KMLサポート、Raster GIS機能やパフォーマンス改善など。

### packages/extensions/custom-layers-manager/src/SVGMapLv0.1_CustomLayersManager_r3module.js

History:
2021/02/10 大まかな外観ができつつあるところ
2021/03/10 ようやく初期的な動作が確認できた

### packages/extensions/custom-layers-manager/src/SVGMapCustomLayersManagerClient.js

History:
2022/07/19- SVGMapウィンド側と、カスタムレイヤマネージャアプリ側のライブラリを切り分け

### packages/extensions/custom-layers-manager/src/SVGMapCustomLayersManagerApp_r3module.js

History:
2021/04/01 Rev1完成かな
2022/07/19 リファクタリング(ESM,class,windowMessaging)

### packages/extensions/cesium/src/3D_extension/SVGMapLv0.1_CesiumWrapper_r4module.js

History:
2018/02/08 Start coding
2018/06/25 Rev3: クロージャ化 , 名称変更: svgMapCesiumWrapper
2022/08/04-開発中 Rec4: ESM化、window間連携のメッセージ化

### packages/extensions/cesium/src/3D_extension/cesiumWindow4_module.js

History:
Rev.1 : 2018/02/10 2D vector view
Rev.3 : 2022/05/20 SVGMap.jsの統一化されたProxy機構を利用可能に

### packages/extensions/authoring/src/SVGMapLv0.1_Authoring_r8_module.js

History:
Rev1..Rev8 にわたるオーサリングツールの進化（2016〜2023）。主要な変更点はモジュール化、ポリゴン/ポリライン編集機能、POIツールの追加等。
Notes:
 root containerでclass=editableの設定がないと、再編集や、レイヤ消去後の再表示での編集結果の保持はできない 2018.2.5

path は 以下のルールとしておこう・・
zが一個でも付いたら無条件でポリゴン認定、
zが一個もない場合
fill="none"でポリライン認定
fillなしもしくはnone以外でポリゴン認定

Notes:
 root containerでclass=editableの設定がないと、再編集や、レイヤ消去後の再表示での編集結果の保持はできない 2018.2.5


---

## Verbatim: Original file headers

Below are the verbatim top-of-file header comment blocks extracted from each source file.

### packages/svgmap/src/SVGMapLv0.1_Class_r18module.js
```text
Description:
Web Mapping Framework based on SVG
SVG Map Level0.1 Implementation
evolved from SVG Map Level0
```

### svgMapLayerLib.js
```text
Description:
Web App Layer Initializer
for SVG Map Level0.1/0.2 Implementation
The html of the SVGMap's web App Layer must import this initializer with the script element.
```

### packages/svgmap/src/libs/ZoomPanManager.js
```text
Description:
ZoomPanManager Class for SVGMap.js
SVGMap.jsのzoom/panに関する機能を制御するモジュール
```

### packages/svgmap/src/libs/UAtester.js
```text
Description:
UAtester Class for SVGMap.js
: ブラウザが何かを判別するクラス
```

### packages/svgmap/src/libs/TransformLib.js
```text
Description:
MatrixUtil Class for SVGMap.js
汎化されたmatrix (GenericMatrix)を用いて、種々の座標変換を行うライブラリクラス
```

### packages/svgmap/src/libs/SvgImageProps.js
```text
Description:
SvgImageProps Class for SVGMap.js
```

### packages/svgmap/src/libs/LayerSpecificWebAppHandler.js
```text
Description:
SVGMap Layer Specific WebApp Handler Module
History of SVGMapLayerUI:
2016/10/14 : svgMapLayerUI2 Rev.1 : SVGMapLvl0.1_r12の新機能を実装する全く新しいUIを再構築開始 まだ全然粗削りです。
2016/10/14 : JQueryUI/multiselectを切り離してスクラッチで構築
2016/10/14 : グループで折りたたむ機能、リストを広げたまま他の作業が行える機能
2016/10/14 : レイヤー固有のGUIを提供するフレームワーク data-controller 属性で、レイヤー固有UIのリンクを記載(html||bitImage)
2016/10/17 : レイヤー固有UI(iframe)に、zoomPanMap イベントを配信
2016/10/28 : Rev.2: classをいろいろ付けた。フレームワーク化
2016/11/15 : レイヤリスト、レイヤ固有UIともに、内容のサイズに応じて縦長さを可変に（まだ不完全かも）
2016/11/15 : レイヤリストのグループに配下で表示しているレイヤの個数を表示
2016/12/?  : GIS Tools Support
2016/12/19 : Authoring Tools Support
2017/01/27 : レイヤ固有UIのリサイズメカニズムを拡張。 data-controllerに、#requiredHeight=hhh&requiredWidth=www　を入れるとできるだけそれを提供する
2017/02/17 : レイヤ固有UIのクローズボタン位置の微調整
2017/02/21 : svg文書のdata-controller-srcに直接レイヤ固有UIのhtmlを書ける機能を拡張。requiredWidth/Heightについてはdata-controllerに#から始まる記法で書くことで対応
2017/03/02 : Rev.3: レイヤーのOffに連動して、レイヤ固有UIのインスタンスが消滅する処理など、レイヤ固有UIのインスタンス管理に矛盾が生じないようにする。レイヤ固有UIインスタンスはレイヤーがvisibleである限り存続する(他のレイヤの固有UIが出現しても隠れるだけで消えない。消えるタイミングはレイヤがinvisibleになった時。またこの時はcloseFrameイベントが発行され、100ms後にインスタンスが消滅する。
2017/08/25 : 凡例（画像）表示時においてサイズ未指定の場合は元画像のサイズでフレームをリサイズする様追加
2017/09/08 : data-controllerに、#exec=appearOnLayerLoad,hiddenOnLayerLoad,onClick(default)
2018/04/02 : layerListmessage に選択レイヤ名称をtextで設定する処理を追加
2019/02/19 : ^>v等のボタンをビットイメージ化　wheel系イベントをモダンに
2019/11/26 : CORSがあれば、別ドメインのレイヤーでもLayerUIframeが動作できるようになった（かも）
2019/12/05 : SVGMap.jsのグローバルエリア"globalMesasge" span要素がある場合、そこに(調停付きで)レイヤー固有UIframeからメッセージを出せるフレームワーク putGlobalMessage()
2020/06/09 : レイヤ固有UIiframeのscriptに、preRenderFunction　という名の関数があると、そのレイヤーの描画前(svgの<script>要素のonzoom,onscroll関数と同じタイミング)に同期的に呼び出される。
2020/10/13 : svgImagesProps[layerID]に.controllerWindowを追加
2020/12/08 : hiddenOnLayerLoad(内部変数hiddenOnLaunch)が複数あった場合にロジックが破綻していたのを修正
2020/11/17-: id:layerList,layerSpecificUIの要素がなかった時ちゃんと動くようにケアした後(特にlayerSpecificUIは今や動的レイヤーで必須の要素化しているので)、layerSpecificUIを別で指定できるようにしたい
             checkLayerListAndRegistLayerUIがid;layerList要素がないときでも動くようにした (checkControllerを発動させている)
             checkControllerなどでshowLayerSpecificUIが発動する。次はこれをid:layerSpecificUIがないケースでも動くようにする
2021/03/09 : Rev.4: 2020/11-2020/12のSVGMapFrame用の改修を導入し、SVGMapCustomLayersManagerの起動機能を実装 (#layerList data-customizerで、カスタマイザを指定するとそれを起動するボタンが出現)
2021/06/17 : レイヤ固有UIでloadイベント時にSVGMapフレームワークがセットされるように
2021/06/22 : zoomPanMapCompletedイベントを実装。レイヤ固有UIでzoomPanMapイベント後 独自のXHRによりデータの取得＆描画更新が行われるようなケースでも、その読み込み完了を検知後に発行するイベント。
2021/09/22 : lauerUIwindowsに.setLoadingFlag(): 非同期処理中を知らせるフラグを明示的にセット・解除可能に
2021/10/29 : setRootLayersPropsで設定する限り(rootSvgのDOM直編集をしない限り)svgMap.updateLayerTableを呼ばなくても問題が起きないように(initLayerList(initOptions) > rev17 core svgMap)
2022/03/08-: コアFWとともに、svgImagesProps[].controllerを構造化、*.svgScript導入しlsUIで実行、従来型*.scriptを廃止
2022/05/31 : ESM, Class化
2023/07/25 : Firefoxの最新版では、力業のiFrameReady()がDOMContentLoadedタイミングをつかんだ処理ができないケースが多い、そこでloadイベント処理のリトライを行うルーチンを入れた（この実装までにかなりの試行錯誤があった）
2023/08/24 : ↑の問題がChromeでも起きる環境があることが判明。iframeのhtmlのキャッシュを無効化することで対応。そろそろ仕様変更などの本質的な対策が求められる
2024/07/23 : To fix issue : https://github.com/svgmap/svgmapjs/issues/5　webAppレイヤーのプログラミング作法の変更あり
```

### packages/svgmap/src/InterWindowMessaging.js
```text
Description:  window間で、メッセージングによってデータのやり取りをする。
```

### packages/svgmap/src/assets/svgMapLayerLib.js
```text
Description:
 Web App Layer Initializer
 for SVG Map Level0.1/0.2 Implementation
```

### packages/extensions/layer-ui/src/SVGMapLv0.1_LayerUI_r6module.js
```text
//
Description:
SVGMap Standard LayerUI2 for SVGMapLv0.1 >rev17
(FIXED?) IE,Edgeでdata-controller-src動作しない
 レイヤ固有UIを別ウィンドウ化できる機能があったほうが良いかも
  ただしこの機能は新たなcontextを生成する形でないと実装できないようです。
```

### packages/extensions/gis/src/SVGMapLv0.1_GIS_r4_module.js
```text
ISSUES:
これらはFixedとなったかな？
!!!!! On going ISSUE 使い続けているとUncaught TypeError: Cannot read property 'points' of undefined at getInRangePointsS2 (SVGMapLv0.1_GIS_r2.js:110x)？？ R15のテストで、避難所と土石流危険渓流とRasterGISで、連続検索実行でテスト可能になってる
今行っているところ、L1361 同一||CORS設定ドメインからの取得
setImageProxyで設定したドメインのURLもしくは・・・って感じが良いと思う

ACTIONS:
・ポリゴン包含、ポリラインクロス等の基本関数(jtsのような) done
・ポイント（マウスポインタ―）と、ポイント、ポリライン、ポリゴンヒットテスト（既存のクリッカブルオブジェクト同等動作）：　ただし、ポイント、ポリラインはバッファが必要なので後回しか？ done
・ラインと、ライン、ポリゴンのヒットテスト done
・ポリゴンと、ポイント、ライン、ポリゴンのヒットテスト done
・カラーピッカーになりえるもの done
・ベクタプロパティの利用 done
・オートパイロット機能のフレームワーク化(vectorGisLayer/rasterGisLayerの実装の改善と取り込み)
・svgMap.setProxyURLFactoryを個々で統合的に設定するようにした方が良いと思う
・入力：
　・マウスポインタ―ベースの対話的に生成されたオブジェクトと指定したレイヤー
　　⇒　マウスポインタ―によるポイント、ライン、ポリゴンの生成ＵＩ
　　⇒　結果的にインタラクティブなオーサリングシステム
　・指定したレイヤー１と、指定したレイヤー２（および　指定したSVG文書１とSVG文書２）
・出力：対象レイヤーのスタイル変更、新規レイヤー生成
```

### packages/extensions/custom-layers-manager/src/SVGMapLv0.1_CustomLayersManager_r3module.js
```text
//
Description:
SVGMap Custom Layers Manager Module for >rev17 of SVGMap Lv0.1 framework
TBDs/ISSUEs
 DONE: 複数のセッティングを使えるように
 DONE: 現在使用中のカスタムレイヤー設定＋レイヤUIでのオンオフ状態をベースにさらに編集
 DONE: viewBoxの設定は？
 DONE: カスタムレイヤー設定を使わない設定
 DONE: レイヤーのclass(グループ)を使う
```

### packages/extensions/custom-layers-manager/src/SVGMapCustomLayersManagerClient.js
```text
Description:
SVGMap Custom Layers Manager Client Module for >rev18esm of SVGMap Lv0.1 framework
```

### packages/extensions/custom-layers-manager/src/SVGMapCustomLayersManagerApp_r3module.js
```text
Description:
Code to build an SVGMap custom layer management app using SVGMapLv0.1_CustomLayersManager_r1.js
ISSUE:
FIXED: 同じオリジンに複数のコンテナがある場合、localStorageはオリジンで共通なので、コンテナのURLを相対パスで扱っているため矛盾が起きる・・

```

### packages/extensions/cesium/src/3D_extension/SVGMapLv0.1_CesiumWrapper_r4module.js
```text
Description:
SVGMapLv0.1_CesiumWrapper_r3.js: SVGMap 3D Visualizer using CesiumJS
Extension for 3D visualization of display content in svgMap_lv0.1*.js with CesiumJS.
```

### packages/extensions/cesium/src/3D_extension/cesiumWindow4_module.js
```text
3D Visualize Window for SVGMap Contents using CESIUM
Assitant for SVGMapLv0.1_CesiumWrapper_r3.js
```

### packages/extensions/authoring/src/SVGMapLv0.1_Authoring_r8_module.js
```text
//
Description:
 SVG Map Authoring Tools Extention for > Rev.14 of SVGMap Level0.1 Framework
```

---

## Additional verbatim header blocks (ISSUES / ACTIONS / TBDs / Notes / History)

### packages/svgmap/src/libs/LayerSpecificWebAppHandler.js — History of SVGMapLayerUI
```text
History of SVGMapLayerUI:
2016/10/14 : svgMapLayerUI2 Rev.1 : SVGMapLvl0.1_r12の新機能を実装する全く新しいUIを再構築開始 まだ全然粗削りです。
2016/10/14 : JQueryUI/multiselectを切り離してスクラッチで構築
2016/10/14 : グループで折りたたむ機能、リストを広げたまま他の作業が行える機能
2016/10/14 : レイヤー固有のGUIを提供するフレームワーク data-controller 属性で、レイヤー固有UIのリンクを記載(html||bitImage)
2016/10/17 : レイヤー固有UI(iframe)に、zoomPanMap イベントを配信
2016/10/28 : Rev.2: classをいろいろ付けた。フレームワーク化
2016/11/15 : レイヤリスト、レイヤ固有UIともに、内容のサイズに応じて縦長さを可変に（まだ不完全かも）
2016/11/15 : レイヤリストのグループに配下で表示しているレイヤの個数を表示
2016/12/?  : GIS Tools Support
2016/12/19 : Authoring Tools Support
2017/01/27 : レイヤ固有UIのリサイズメカニズムを拡張。 data-controllerに、#requiredHeight=hhh&requiredWidth=www　を入れるとできるだけそれを提供する
2017/02/17 : レイヤ固有UIのクローズボタン位置の微調整
2017/02/21 : svg文書のdata-controller-srcに直接レイヤ固有UIのhtmlを書ける機能を拡張。requiredWidth/Heightについてはdata-controllerに#から始まる記法で書くことで対応
2017/03/02 : Rev.3: レイヤーのOffに連動して、レイヤ固有UIのインスタンスが消滅する処理など、レイヤ固有UIのインスタンス管理に矛盾が生じないようにする。レイヤ固有UIインスタンスはレイヤーがvisibleである限り存続する(他のレイヤの固有UIが出現しても隠れるだけで消えない。消えるタイミングはレイヤがinvisibleになった時。またこの時はcloseFrameイベントが発行され、100ms後にインスタンスが消滅する。
2017/08/25 : 凡例（画像）表示時においてサイズ未指定の場合は元画像のサイズでフレームをリサイズする様追加
2017/09/08 : data-controllerに、#exec=appearOnLayerLoad,hiddenOnLayerLoad,onClick(default)
2018/04/02 : layerListmessage に選択レイヤ名称をtextで設定する処理を追加
2019/02/19 : ^>v等のボタンをビットイメージ化　wheel系イベントをモダンに
2019/11/26 : CORSがあれば、別ドメインのレイヤーでもLayerUIframeが動作できるようになった（かも）
2019/12/05 : SVGMap.jsのグローバルエリア"globalMesasge" span要素がある場合、そこに(調停付きで)レイヤー固有UIframeからメッセージを出せるフレームワーク putGlobalMessage()
2020/06/09 : レイヤ固有UIiframeのscriptに、preRenderFunction　という名の関数があると、そのレイヤーの描画前(svgの<script>要素のonzoom,onscroll関数と同じタイミング)に同期的に呼び出される。
2020/10/13 : svgImagesProps[layerID]に.controllerWindowを追加
2020/12/08 : hiddenOnLayerLoad(内部変数hiddenOnLaunch)が複数あった場合にロジックが破綻していたのを修正
2020/11/17-: id:layerList,layerSpecificUIの要素がなかった時ちゃんと動くようにケアした後(特にlayerSpecificUIは今や動的レイヤーで必須の要素化しているので)、layerSpecificUIを別で指定できるようにしたい
             checkLayerListAndRegistLayerUIがid;layerList要素がないときでも動くようにした (checkControllerを発動させている)
             checkControllerなどでshowLayerSpecificUIが発動する。次はこれをid:layerSpecificUIがないケースでも動くようにする
2021/03/09 : Rev.4: 2020/11-2020/12のSVGMapFrame用の改修を導入し、SVGMapCustomLayersManagerの起動機能を実装 (#layerList data-customizerで、カスタマイザを指定するとそれを起動するボタンが出現)
2021/06/17 : レイヤ固有UIでloadイベント時にSVGMapフレームワークがセットされるように
2021/06/22 : zoomPanMapCompletedイベントを実装。レイヤ固有UIでzoomPanMapイベント後 独自のXHRによりデータの取得＆描画更新が行われるようなケースでも、その読み込み完了を検知後に発行するイベント。
2021/09/22 : lauerUIwindowsに.setLoadingFlag(): 非同期処理中を知らせるフラグを明示的にセット・解除可能に
2021/10/29 : setRootLayersPropsで設定する限り(rootSvgのDOM直編集をしない限り)svgMap.updateLayerTableを呼ばなくても問題が起きないように(initLayerList(initOptions) > rev17 core svgMap)
2022/03/08-: コアFWとともに、svgImagesProps[].controllerを構造化、*.svgScript導入しlsUIで実行、従来型*.scriptを廃止
2022/05/31 : ESM, Class化
2023/07/25 : Firefoxの最新版では、力業のiFrameReady()がDOMContentLoadedタイミングをつかんだ処理ができないケースが多い、そこでloadイベント処理のリトライを行うルーチンを入れた（この実装までにかなりの試行錯誤があった）
2023/08/24 : ↑の問題がChromeでも起きる環境があることが判明。iframeのhtmlのキャッシュを無効化することで対応。そろそろ仕様変更などの本質的な対策が求められる
2024/07/23 : To fix issue : https://github.com/svgmap/svgmapjs/issues/5　webAppレイヤーのプログラミング作法の変更あり
```

### packages/extensions/gis/src/SVGMapLv0.1_GIS_r4_module.js — ISSUES / ACTIONS
```text
ISSUES:

--- これらはFixedとなったかな？
!!!!! On going ISSUE 使い続けているとUncaught TypeError: Cannot read property 'points' of undefined at getInRangePointsS2 (SVGMapLv0.1_GIS_r2.js:110x)？？ R15のテストで、避難所と土石流危険渓流とRasterGISで、連続検索実行でテスト可能になってる

今行っているところ、L1361 同一||CORS設定ドメインからの取得
setImageProxyで設定したドメインのURLもしくは・・・って感じが良いと思う

ACTIONS:
・ポリゴン包含、ポリラインクロス等の基本関数(jtsのような) done
・ポイント（マウスポインタ―）と、ポイント、ポリライン、ポリゴンヒットテスト（既存のクリッカブルオブジェクト同等動作）：　ただし、ポイント、ポリラインはバッファが必要なので後回しか？ done
・ラインと、ライン、ポリゴンのヒットテスト done
・ポリゴンと、ポイント、ライン、ポリゴンのヒットテスト done
・カラーピッカーになりえるもの done
・ベクタプロパティの利用 done
・オートパイロット機能のフレームワーク化(vectorGisLayer/rasterGisLayerの実装の改善と取り込み)
・svgMap.setProxyURLFactoryを個々で統合的に設定するようにした方が良いと思う

・入力：
　・マウスポインタ―ベースの対話的に生成されたオブジェクトと指定したレイヤー
　　⇒　マウスポインタ―によるポイント、ライン、ポリゴンの生成ＵＩ
　　⇒　結果的にインタラクティブなオーサリングシステム
　・指定したレイヤー１と、指定したレイヤー２（および　指定したSVG文書１とSVG文書２）
・出力：対象レイヤーのスタイル変更、新規レイヤー生成
```

### packages/extensions/custom-layers-manager/src/SVGMapLv0.1_CustomLayersManager_r3module.js — TBDs/ISSUEs
```text
TBDs/ISSUEs
 DONE: 複数のセッティングを使えるように
 DONE: 現在使用中のカスタムレイヤー設定＋レイヤUIでのオンオフ状態をベースにさらに編集
 DONE: viewBoxの設定は？
 DONE: カスタムレイヤー設定を使わない設定
 DONE: レイヤーのclass(グループ)を使う
```

### packages/extensions/layer-ui/src/SVGMapLv0.1_LayerUI_r6module.js — FIXED?/Notes
```text
(FIXED?) IE,Edgeでdata-controller-src動作しない
 レイヤ固有UIを別ウィンドウ化できる機能があったほうが良いかも
  ただしこの機能は新たなcontextを生成する形でないと実装できないようです。
 (FIXED? 2017.9.8) レイヤUI表示ボタンが時々表示されない時がある (少なくとも一か所課題を発見し修正。本体も改修(getRootLayersProps))
 zoomPanMapCompletedは、fetchとXHRだけを見ているが、IndexedDBやworkerも見るようにすべき
```

### packages/extensions/authoring/src/SVGMapLv0.1_Authoring_r8_module.js — Notes (excerpt)
```text
Notes:
 root containerでclass=editableの設定がないと、再編集や、レイヤ消去後の再表示での編集結果の保持はできない 2018.2.5

path は 以下のルールとしておこう・・

### packages/svgmap/src/libs/ResourceLoadingObserver.js

```text
Description:
ResourceLoadingObserver Class for SVGMap.js
Programmed by Satoru Takagi
```

### packages/svgmap/src/libs/UtilFuncs.js

```text
Description:
UtilFuncs Class for SVGMap.js
なんかいろいろ使われている単純なstaticな関数を集めたもの・・
全部staticとする
```

### packages/svgmap/src/libs/ResumeManager.js

```text
Description:
ResumeManager Class for SVGMap.js
```

### packages/svgmap/src/libs/ProxyManager.js

```text
Description:
ProxyManager Class for SVGMap.js
```

### packages/svgmap/src/libs/SvgStyle.js

```text
Description:
SvgStyle Class for SVGMap.js
```

### packages/svgmap/src/libs/PathRenderer.js

```text
Description:
PathRenderer Class for SVGMap.js
```

### packages/svgmap/src/libs/PoiHitTester.js

```text
Description:
PoiHitTester Class for SVGMap.js
```

### packages/svgmap/src/libs/ShowPoiProperty.js

```text
Description:
ShowPoiProperty Class for SVGMap.js
```

### packages/svgmap/src/libs/SvgMapElementType.js

```text
Description:
SvgMapElementType Class for SVGMap.js
```

### packages/svgmap/src/libs/SVGMapSerializer_obsoluted.js

```text
Description:
SVGMapSerializer Class
```

### packages/svgmap/src/libs/TernarySimultaneousEquationsSolution.js

```text
Description:
TernarySimultaneousEquationsSolution Class for SVGMap.js
zが一個でも付いたら無条件でポリゴン認定、
zが一個もない場合
fill="none"でポリライン認定
fillなしもしくはnone以外でポリゴン認定
```

### packages/svgmap/dist/svgMapLayerLib.js — History / Note
```text
History:
2024/07/23 1st implementatiion, to fix https://github.com/svgmap/svgmapjs/issues/5

Note:
将来、このイニシャライザーは、より高度・複雑な実装になる可能性がある。またWeb App Layerの作法もさらに変更される可能性もある
今のところWebAppLayerはESMを必須としていない為、このライブラリもmoduleではないことにしている。
```
