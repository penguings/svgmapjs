//
// Description:
// SVGMap Standard LayerUI2 for SVGMapLv0.1 >rev17
//
//

// (FIXED?) IE,Edgeでdata-controller-src動作しない
//  レイヤ固有UIを別ウィンドウ化できる機能があったほうが良いかも
//   ただしこの機能は新たなcontextを生成する形でないと実装できないようです。
//   See also: http://stackoverflow.com/questions/8318264/how-to-move-an-iframe-in-the-dom-without-losing-its-state
//  (FIXED? 2017.9.8) レイヤUI表示ボタンが時々表示されない時がある (少なくとも一か所課題を発見し修正。本体も改修(getRootLayersProps))
//  zoomPanMapCompletedは、fetchとXHRだけを見ているが、IndexedDBやworkerも見るようにすべき

import { BuiltinIcons, LayerStyleCustomizer, UtilFuncs } from "@penguings/svgmapjs";

class SvgMapLayerUI {
	#layerListID = "layerList";

	#layerList;
	//#uiOpen; //ないかも
	#layerTableDiv;
	#uiOpened;
	#layerGroupStatus; // layerGroupStatusは今はグループ折り畳み状態のみ管理
	//#layerSpecificUI; // layerSpecificUIの要素
	#svgMap;
	#layerSpecificWebAppHandler;
	#layersCustomizer;

	#layerListMaxHeightStyle;
	#layerListMaxHeight;
	#layerListFoldedHeight;

	#layerListmessageHead = "Layer List: ";
	#layerListmessageFoot = " layers visible";

	#layerStyleCustomizer;

	constructor(svgMapObj, layerSpecificWebAppHandlerObj) {
		this.#svgMap = svgMapObj;
		svgMapObj.registLayerUiSetter(
			// この関数の呼び出しは必須
			// 第一引数に、起動時に一回だけ呼ばれる初期化関数を設置
			function (opt) {
				this.#initLayerList(opt);
			}.bind(this),
			// 第二引数に、レイヤーリストUIを更新する関数を設置
			function () {
				this.#updateLayerTable();
			}.bind(this)
		);
		this.#layerSpecificWebAppHandler = layerSpecificWebAppHandlerObj;
		// console.log("construct layerUI:");
		this.#layerStyleCustomizer = new LayerStyleCustomizer(svgMapObj);
	}

	#updateLayerTable() {
		var tb = document.getElementById("layerTable");
		var lps = this.#svgMap.getRootLayersProps();
		if (tb) {
			var ltst = this.#layerTableDiv.scrollTop;
			this.#removeAllLayerItems(tb);
			this.#setLayerTable(tb, lps);
			this.#layerTableDiv.scrollTop = ltst;
		}

		// レイヤー固有UIの状態を更新(レイヤーリストUIのレイヤー固有UI表示をsetLayerSpecificWebAppLaunchUiEnable経由での更新を含む)
		// この関数はレイヤー固有UIの整合性を取るため、レイヤーの表示状態変更時に呼び出しが必要
		this.#layerSpecificWebAppHandler.updateLayerSpecificWebAppHandler();
	}

	#layerListOpenClose() {
		// console.log("layerListOpenClose");
		if (this.#layerList.style.height == this.#layerListFoldedHeight + "px") {
			// layer list is colsed
			this.#setLayerListOpenClose(true);
		} else {
			// opened
			this.#setLayerListOpenClose(false);
		}
	}

	#setLayerListOpenClose(openFlg) {
		var uiOpenBtn = document.getElementById("layerListOpenButton");
		const hfb = document.getElementById("svgMapHiddenFilterButton");
		this.#layerTableDiv = document.getElementById("layerTableDiv");
		if (
			openFlg &&
			this.#layerList.style.height == this.#layerListFoldedHeight + "px"
		) {
			// layer list close to open
			this.#updateLayerTable();
			this.#layerList.style.height = this.#layerListMaxHeightStyle;
			uiOpenBtn.firstChild.src = BuiltinIcons.UTpng;
			this.#layerTableDiv.style.display = "";
			this.#uiOpened = true;
			if (hfb) {
				hfb.style.visibility = "visible";
			}
		} else if (
			!openFlg &&
			this.#layerList.style.height != this.#layerListFoldedHeight + "px"
		) {
			// layer list open to close
			this.#layerList.style.height = this.#layerListFoldedHeight + "px";
			uiOpenBtn.firstChild.src = BuiltinIcons.DTpng;
			this.#layerTableDiv.style.display = "none";
			this.#uiOpened = false;
			if (hfb) {
				hfb.style.visibility = "hidden";
			}
		}
	}

	#getGroupFoldingStatus(groupName) {
		// グループ折り畳み状況回答
		var gfolded;
		if (this.#layerGroupStatus[groupName]) {
			// グループ折り畳み状態を得る[デフォルトはopen]
			gfolded = this.#layerGroupStatus[groupName];
		} else {
			gfolded = false;
			this.#layerGroupStatus[groupName] = gfolded;
		}
		return gfolded;
	}

	#setLayerTable(tb, layerProps) {
		// console.log("call setLayerTable:",tb);
		var groups = new Object(); // ハッシュ名のグループの最後のtr項目を収めている
		var lps;
		if (!lps) {
			lps = this.#svgMap.getRootLayersProps();
		} else {
			lps = layerProps;
		}
		// console.log(lps);
		var visibleLayers = 0;
		var visibleLayersNameArray = [];
		const visibleNum = 5; // 表示レイヤ名称数
		for (var i = lps.length - 1; i >= 0; i--) {
			if (this.#layerListOptions.hiddenFilter && !lps[i].visible) {
				continue;
			}
			var tr = this.#getLayerTR(
				lps[i].title,
				lps[i].id,
				lps[i].visible,
				false,
				lps[i].groupName
			);
			if (lps[i].groupName) {
				// グループがある場合の処理

				var gfolded = this.#getGroupFoldingStatus(lps[i].groupName); // グループ折り畳み状況獲得

				if (groups[lps[i].groupName]) {
					// すでにグループが記載されている場合
					//そのグループの最後の項目として追加
					var lastGroupMember = groups[lps[i].groupName];
					if (!gfolded) {
						tb.insertBefore(tr, lastGroupMember.nextSibling);
					}
					groups[lps[i].groupName] = tr;
				} else {
					// 新しくグループ用trを生成・項目追加
					var groupTr = this.#getGroupTR(lps[i], gfolded);
					tb.appendChild(groupTr);
					// その後にレイヤー項目を追加
					groups[lps[i].groupName] = tr;
					if (!gfolded) {
						tb.appendChild(tr);
					}
				}
				if (lps[i].visible) {
					this.#incrementGcountLabel(lps[i].groupName);
				}
			} else {
				// グループに属さない場合、単に項目追加
				tb.appendChild(tr);
			}
			if (lps[i].visible) {
				++visibleLayers;
				if (visibleLayers <= visibleNum) {
					visibleLayersNameArray.push(lps[i].title);
				} else if (visibleLayers == visibleNum + 1) {
					visibleLayersNameArray.push("...");
				}
			}
		}
		document.getElementById("layerListmessage").innerHTML =
			this.#layerListmessageHead + visibleLayers + this.#layerListmessageFoot;
		document.getElementById("layerListmessage").title = visibleLayersNameArray;
		window.setTimeout(
			function () {
				this.#setLayerTableStep2();
			}.bind(this),
			30
		);
	}

	#setLayerListmessage(head, foot) {
		// added 2018.2.6
		this.#layerListmessageHead = head;
		this.#layerListmessageFoot = foot;
		/**
		if ( document.getElementById("layerListmessage")){
			document.getElementById("layerListmessage").innerHTML = layerListmessageHead + visibleLayers + layerListmessageFoot;
		}
		**/
	}

	#setLayerTableStep2() {
		var tableHeight = document.getElementById("layerTable").offsetHeight;
		if (tableHeight == 0) {
			// patch 2020/10/28 (レイヤリスト閉じているときにレイヤ追加されたりしてupdateLayerTableすると2クリックしないと開かない微妙な不具合)
			return;
		}
		// console.log(tableHeight, layerListMaxHeight , layerListFoldedHeight , layerListMaxHeightStyle );
		if (
			tableHeight <
			this.#layerListMaxHeight - this.#layerListFoldedHeight - 2
		) {
			this.#layerList.style.height =
				tableHeight + this.#layerListFoldedHeight + 2 + "px";
			// console.log("reorder:", this.#layerList.style.height);
		} else {
			this.#layerList.style.height = this.#layerListMaxHeightStyle;
			// 	layerListMaxHeight = layerList.offsetHeight;
		}
	}

	#incrementGcountLabel(groupName) {
		var gcLabel = document.getElementById("gc_" + groupName);
		var gcTxtNode = gcLabel.childNodes.item(0);
		var gCount = Number(gcTxtNode.nodeValue) + 1;
		// console.log(groupName,gcTxtNode,gcTxtNode.nodeValue,gCount);
		gcTxtNode.nodeValue = gCount;
	}

	#getLayerTR(title, id, visible, hasLayerList, groupName) {
		var tr = document.createElement("tr");
		tr.id = "layerList_" + id;
		if (groupName) {
			tr.dataset.group = groupName;
			tr.className = "layerItem";
		} else {
			tr.className = "layerItem noGroup";
		}
		var cbid = "cb_" + id; // id for each layer's check box
		var ck = "";

		// レイヤラベルおよびオンオフチェックボックス生成.
		// checkBox
		var lcbtd = document.createElement("td");
		var lcb = document.createElement("input");
		lcb.className = "layerCheck";
		lcb.type = "checkBox";
		lcb.id = cbid;
		if (visible) {
			lcb.checked = true;
			tr.style.fontWeight = "bold"; // bold style for All TR elem.
		}
		lcb.addEventListener(
			"change",
			function (event) {
				this.#toggleLayer(event);
			}.bind(this)
		);
		lcbtd.appendChild(lcb);
		tr.appendChild(lcbtd);
		// label
		var labeltd = document.createElement("td");
		labeltd.setAttribute("colspan", "3");
		labeltd.style.overflow = "hidden";
		var label = document.createElement("label");
		label.title = title;
		label.setAttribute("for", cbid);
		label.className = "layerLabel";
		label.innerHTML = title;
		labeltd.appendChild(label);
		tr.appendChild(labeltd);

		var td = document.createElement("td");
		// レイヤスタイルカスタマイザUIボタンの生成
		if (this.#layerListOptions.styleController) {
			this.#setLayerStyleCustomizerUiButton(td, visible, id);
		}
		// レイヤ固有UIのボタン生成
		this.#setLayerSpecificUiButton(td, visible, hasLayerList, id);
		tr.appendChild(td);

		return tr;
	}

	#setLayerSpecificUiButton(td, visible, hasLayerList, id) {
		var btid = "bt_" + id; // id for each button for layer specific UI
		var btn = document.createElement("button");
		btn.innerHTML =
			"<img style='pointer-events: none;' src='" + BuiltinIcons.RTpng + "'>";
		// btn.type="button";
		btn.className = "layerUiButton";
		btn.id = btid;
		// btn.value=">";
		// btn.setAttribute("onClick","svgMapLayerUI.showLayerSpecificUI(event)");
		btn.addEventListener(
			"click",
			function (event) {
				var layerId = this.#getLayerId(event);
				this.#layerSpecificWebAppHandler.showLayerSpecificUI(layerId); // hiddenもcbfも不要でレイヤ固有UI表示
			}.bind(this),
			false
		);
		if (visible) {
			btn.disabled = false;
		} else {
			btn.disabled = true;
		}
		if (!hasLayerList) {
			btn.style.visibility = "hidden";
		}

		td.appendChild(btn);
	}

	#setLayerStyleCustomizerUiButton(td, visible, id) {
		var lscBtId = "lscBt_" + id;
		var lscBtn = document.createElement("img");
		lscBtn.src = BuiltinIcons.slenderHamburger;
		/**
		lscBtn.innerHTML =
			"<img style='pointer-events: none' src='" + BuiltinIcons.slenderHamburger + "'>";
		**/
		lscBtn.className = "layerStyleCustomizerUiButton";
		lscBtn.id = lscBtId;
		lscBtn.style.verticalAlign = "middle";
		lscBtn.style.padding = "3px 5px";
		lscBtn.style.cursor = "pointer";
		//		lscBtn.style.padding="1px";
		//		lscBtn.style.border="none";
		lscBtn.addEventListener(
			"click",
			function (event) {
				console.log(
					"レイヤスタイルカスタマイザを起動するイベントが出ました : id:",
					id
				);
				this.#layerStyleCustomizer.openCustomizerUI(id);
			}.bind(this),
			false
		);
		lscBtn.addEventListener("mouseover", () => {
			lscBtn.style.backgroundColor = "#ddd";
		});
		lscBtn.addEventListener("mouseout", () => {
			lscBtn.style.backgroundColor = "";
		});
		if (visible) {
			lscBtn.disabled = false;
		} else {
			lscBtn.disabled = true;
			lscBtn.style.visibility = "hidden";
		}
		td.appendChild(lscBtn);
	}

	#setLayerSpecificWebAppLaunchUiEnable(layerId) {
		// console.log("setLayerSpecificWebAppLaunchUiEnable:", layerId);
		var ctbtn = document.getElementById("bt_" + layerId);
		if (ctbtn) {
			// グループが閉じられている場合などにはボタンがないので
			ctbtn.style.visibility = "visible";
		} else {
			console.log(
				"Could not find launcher button: setLayerSpecificWebAppLaunchUiEnable:",
				layerId
			);
		}
	}

	#getGroupTR(lp, gfolded) {
		// グループ項目を生成する

		var groupTr = document.createElement("tr");
		groupTr.dataset.group = lp.groupName;
		groupTr.className = "groupItem";
		groupTr.style.width = "100%";
		groupTr.id = "gtr_" + lp.groupName;
		var isBatchGroup = false;

		// グループのラベル
		var groupTD = document.createElement("td");
		groupTD.style.fontWeight = "bold";
		groupTD.setAttribute("colspan", "3");
		groupTD.className = "groupLabel";
		groupTD.style.overflow = "hidden";

		var groupTDlabel = document.createElement("label");
		groupTDlabel.title = lp.groupName;
		var gbid = "gb_" + lp.groupName; // for fold checkbox
		groupTDlabel.setAttribute("for", gbid);

		var gLabel = document.createTextNode("[" + lp.groupName + "]");
		groupTDlabel.appendChild(gLabel);
		groupTD.appendChild(groupTDlabel);

		// グループの所属メンバー数
		var groupCountTD = document.createElement("td");
		groupCountTD.className = "groupLabel";
		// groupCountTD.style.overflow="hidden";
		groupCountTD.align = "right";

		var groupCountlabel = document.createElement("label");
		groupCountlabel.id = "gc_" + lp.groupName;

		groupCountlabel.setAttribute("for", gbid);

		var gCount = document.createTextNode("0");
		groupCountlabel.appendChild(gCount);
		groupCountTD.appendChild(groupCountlabel);

		// バッチチェックボックス
		var bid = "";
		if (lp.groupFeature == "batch") {
			groupTD.setAttribute("colspan", "2");
			var batchCheckBoxTd = document.createElement("td");

			isBatchGroup = true;
			bid = "ba_" + lp.groupName;

			var batchCheckBox = document.createElement("input");
			batchCheckBox.type = "checkBox";
			batchCheckBox.id = bid;
			batchCheckBox.addEventListener(
				"change",
				function (event) {
					this.#toggleBatch(event);
				}.bind(this),
				false
			);

			batchCheckBoxTd.appendChild(batchCheckBox);

			// 	groupTD.appendChild(batchCheckBox);
			if (lp.visible) {
				batchCheckBox.checked = "true";
			}
			groupTr.appendChild(groupTD);
			groupTr.appendChild(groupCountTD);
			groupTr.appendChild(batchCheckBoxTd);
		} else {
			groupTr.appendChild(groupTD);
			groupTr.appendChild(groupCountTD);
		}

		// group fold button
		var foldTd = document.createElement("td");
		var foldButton = document.createElement("button");
		foldButton.id = gbid;
		// foldButton.type="button";
		foldButton.addEventListener(
			"click",
			function (event) {
				this.#toggleGroupFold(event);
			}.bind(this),
			false
		);
		if (!gfolded) {
			foldButton.innerHTML =
				"<img style='pointer-events: none;' src='" + BuiltinIcons.UTpng + "'>";
		} else {
			foldButton.innerHTML =
				"<img style='pointer-events: none;' src='" + BuiltinIcons.DTpng + "'>";
		}
		foldTd.appendChild(foldButton);
		groupTr.appendChild(foldTd);

		return groupTr;
	}

	#removeAllLayerItems(tb) {
		for (var i = tb.childNodes.length - 1; i >= 0; i--) {
			tb.removeChild(tb.childNodes[i]);
		}
		tb.appendChild(this.#getColgroup());
	}

	#getLayerId(layerEvent) {
		// console.log(layerEvent);
		var lid = layerEvent.target.id.substring(3);
		return lid;
	}

	#toggleLayer(e) {
		var lid = this.#getLayerId(e);
		// console.log("this:", this);
		// console.log("call toggle Layer",e.target.id,e.target.checked,lid);
		this.#svgMap.setRootLayersProps(lid, e.target.checked, false);

		// 後でアイテム消さないように効率化したい・・ (refreshLayerTable..)
		this.#svgMap.refreshScreen();
	}

	#toggleBatch(e) {
		var lid = this.#getLayerId(e);
		// console.log("call toggle Batch",e.target.id,e.target.checked,lid);
		var batchLayers = this.#svgMap.getSwLayers("batch");
		// console.log("this ID might be a batch gruop. :"+ lid,batchLayers);

		// svgMap.setRootLayersProps(lid, e.target.checked , false );

		// ひとつでもhiddenのレイヤーがあれば全部visibleにする
		var bVisibility = "hidden";
		for (var i = 0; i < batchLayers[lid].length; i++) {
			if (batchLayers[lid][i].getAttribute("visibility") == "hidden") {
				bVisibility = "visible";
				break;
			}
		}
		for (var i = 0; i < batchLayers[lid].length; i++) {
			batchLayers[lid][i].setAttribute("visibility", bVisibility);
		}

		// 後でアイテム消さないように効率化する・・ (refreshLayerTable..)
		this.#updateLayerTable(); // こちらはDOM直接操作しているので必要
		this.#svgMap.refreshScreen();
	}

	#layerListOptions = {};

	#initLayerList(initOptions) {
		if (initOptions) {
			// obsoluted
			/**
			if (initOptions.updateLayerListUITiming){
				this.#updateLayerListUITiming = initOptions.updateLayerListUITiming;
			}
			**/
		}
		// console.log("CALLED initLayerList");
		this.#layerGroupStatus = new Object();
		this.#layerList = document.getElementById(this.#layerListID);

		var llUItop;

		if (this.#layerList) {
			if (this.#layerList.getAttribute("data-fixed") != null) {
				// レイヤ開閉機能なし・固定状態
				this.#layerListOptions.fixed = true;
			}
			if (this.#layerList.getAttribute("data-opened") != null) {
				// 開いた状態で起動
				this.#layerListOptions.initOpen = true;
			}
			if (this.#layerList.getAttribute("data-layerstylecontroller") != null) {
				// レイヤのスタイル制御UIを出現させる
				this.#layerListOptions.styleController = true;
			}
			if (this.#layerList.getAttribute("data-hiddenfilter") != null) {
				// hideのレイヤーをリストから消す機能
				this.#layerListOptions.hiddenFilterUI = true;
			}
			if (this.#layerList.getAttribute("data-customizer") != null) {
				// hideのレイヤーをリストから消す機能
				this.#layerListOptions.layersCustomizerPath =
					this.#layerList.getAttribute("data-customizer");
			}
			//console.log("#layerListOptions:",this.#layerListOptions);

			this.#initLayerListElem();

			llUItop = document.createElement("div");
			llUItop.id = "layerListUiTopDiv";
			if (this.#layerListOptions.hiddenFilterUI) {
				this.#initLayerHiddenUI(llUItop);
			}
			this.#initLayerListUiTopLabelElem(llUItop);
			this.#initLayerListUiTopButtonElem(llUItop);
			if (this.#layerListOptions.layersCustomizerPath) {
				this.#initLayersCustomizerIcon(llUItop);
			}

			this.#layerList.appendChild(llUItop);

			this.#initLayerListUiElem();
		}
		window.setTimeout(
			function (llUItop) {
				this.#initLayerListStep2(llUItop);
				if (this.#layerListOptions.fixed) {
					this.#setLayerListFixed();
				} else if (this.#layerListOptions.initOpen) {
					this.#setLayerListOpenClose(true);
				}
			}.bind(this),
			30,
			llUItop
		);
	}

	#setLayerListFixed() {
		this.#setLayerListOpenClose(true);
		var uiOpenBtn = document.getElementById("layerListOpenButton");
		uiOpenBtn.disabled = true;
		uiOpenBtn.style.display = "none";
		var layersCustomizerBtn = document.getElementById(
			"layersCustomizerImageButton"
		);
		layersCustomizerBtn.style.right = "5px";
	}

	#initLayerListElem() {
		this.#layerList.addEventListener(
			"wheel",
			function (event) {
				UtilFuncs.MouseWheelListenerFunc(event);
			}.bind(this),
			false
		); // added 2019/04/15
		this.#layerList.addEventListener(
			"mousewheel",
			function (event) {
				UtilFuncs.MouseWheelListenerFunc(event);
			}.bind(this),
			false
		);
		this.#layerList.addEventListener(
			"DOMMouseScroll",
			function (event) {
				UtilFuncs.MouseWheelListenerFunc(event);
			}.bind(this),
			false
		);
		this.#layerList.style.zIndex = "20";
		this.#layerListMaxHeightStyle = this.#layerList.style.height;
	}

	#initLayerListUiTopLabelElem(layerListUiTopElem) {
		var lps = this.#svgMap.getRootLayersProps();
		var visibleLayers = 0;
		var visibleLayersNameArray = [];
		const visibleNum = 5; // 表示レイヤ名称数
		for (var i = lps.length - 1; i >= 0; i--) {
			if (lps[i].visible) {
				++visibleLayers;
				if (visibleLayers <= visibleNum) {
					visibleLayersNameArray.push(lps[i].title);
				} else if (visibleLayers == visibleNum + 1) {
					visibleLayersNameArray.push("...");
				}
			}
		}
		var llUIlabel = document.createElement("label");
		llUIlabel.id = "layerListmessage";
		llUIlabel.setAttribute("for", "layerListOpenButton");
		llUIlabel.setAttribute("title", visibleLayersNameArray);
		llUIlabel.innerHTML =
			this.#layerListmessageHead + visibleLayers + this.#layerListmessageFoot;
		layerListUiTopElem.appendChild(llUIlabel);
	}

	#initLayerListUiTopButtonElem(layerListUiTopElem) {
		var llUIbutton = document.createElement("button");
		llUIbutton.id = "layerListOpenButton";
		llUIbutton.innerHTML =
			"<img style='pointer-events: none;' src='" + BuiltinIcons.DTpng + "'>";
		llUIbutton.style.position = "absolute";
		llUIbutton.style.right = "0px";
		llUIbutton.addEventListener(
			"click",
			function (event) {
				this.#layerListOpenClose(event);
			}.bind(this)
		);
		layerListUiTopElem.appendChild(llUIbutton);
	}

	#initLayersCustomizerIcon(layerListUiTopElem) {
		var layersCustomizerPath = this.#layerListOptions.layersCustomizerPath;
		if (layersCustomizerPath) {
			var layersCustomizerIcon = document.createElement("img");
			layersCustomizerIcon.src = BuiltinIcons.hamburger;
			layersCustomizerIcon.style.position = "absolute";
			layersCustomizerIcon.id = "layersCustomizerImageButton";
			layersCustomizerIcon.style.right = "35px";
			layersCustomizerIcon.style.cursor = "pointer";
			layerListUiTopElem.appendChild(layersCustomizerIcon);
			layersCustomizerIcon.addEventListener(
				"click",
				function (event) {
					this.#layersCustomizer = window.open(
						layersCustomizerPath,
						"layersCustomizer",
						"toolbar=yes,menubar=yes,scrollbars=yes"
					);
				}.bind(this)
			);
			layersCustomizerIcon.addEventListener("mouseover", () => {
				layersCustomizerIcon.style.backgroundColor = "#ddd";
			});
			layersCustomizerIcon.addEventListener("mouseout", () => {
				layersCustomizerIcon.style.backgroundColor = "";
			});
		}
	}

	#initLayerListUiElem() {
		var llUIdiv = document.createElement("div");
		this.#layerTableDiv = llUIdiv;
		llUIdiv.id = "layerTableDiv";
		llUIdiv.style.width = "100%";
		llUIdiv.style.height = "100%";
		llUIdiv.style.overflowY = "scroll";
		llUIdiv.style.display = "none";

		this.#layerList.appendChild(llUIdiv);

		var llUItable = document.createElement("table");
		llUItable.id = "layerTable";
		llUItable.setAttribute("border", "0");
		llUItable.style.width = "100%";
		llUItable.style.tableLayout = "fixed";
		llUItable.style.whiteSpace = "nowrap";

		llUItable.appendChild(this.#getColgroup());

		llUIdiv.appendChild(llUItable);
	}

	#initLayerListStep2(llUItop) {
		// レイヤリストのレイアウト待ち後サイズを決める　もうちょっとスマートな方法ないのかな・・
		if (llUItop) {
			this.#layerListFoldedHeight = llUItop.offsetHeight;

			if (this.#layerList.offsetHeight < 60) {
				this.#layerListMaxHeightStyle = "90%";
			}

			this.#layerListMaxHeight = this.#layerList.offsetHeight;

			// console.log("LL dim:",layerListMaxHeightStyle,layerListFoldedHeight);

			this.#layerList.style.height = this.#layerListFoldedHeight + "px";
		}
	}

	#getColgroup() {
		var llUIcolgroup = document.createElement("colgroup");

		var llUIcol1 = document.createElement("col");
		llUIcol1.setAttribute("spanr", "1");
		llUIcol1.style.width = "22px";
		var llUIcol2 = document.createElement("col");
		llUIcol2.setAttribute("spanr", "1");
		var llUIcol3 = document.createElement("col");
		llUIcol3.setAttribute("spanr", "1");
		llUIcol3.style.width = "22px";
		var llUIcol4 = document.createElement("col");
		llUIcol4.setAttribute("spanr", "1");
		llUIcol4.style.width = "22px";
		var llUIcol5 = document.createElement("col");
		llUIcol5.setAttribute("spanr", "1");
		if (this.#layerListOptions.styleController) {
			llUIcol5.style.width = "38px";
		} else {
			llUIcol5.style.width = "28px";
		}

		llUIcolgroup.appendChild(llUIcol1);
		llUIcolgroup.appendChild(llUIcol2);
		llUIcolgroup.appendChild(llUIcol3);
		llUIcolgroup.appendChild(llUIcol4);
		llUIcolgroup.appendChild(llUIcol5);

		return llUIcolgroup;
	}

	#toggleGroupFold(e) {
		var lid = this.#getLayerId(e);
		// console.log("call toggle Group Hidden",e.target.id,e.target.checked,lid);
		if (this.#layerGroupStatus[lid]) {
			this.#layerGroupStatus[lid] = false;
		} else {
			this.#layerGroupStatus[lid] = true;
		}
		this.#updateLayerTable();
	}

	#initLayerHiddenUI(layerListUiTopElem) {
		const img = document.createElement("img");
		img.src = BuiltinIcons.visibleIcon;
		img.id = "svgMapHiddenFilterButton";
		img.title =
			"Toggle between showing only the layer currently displayed or all layers";
		img.style.verticalAlign = "middle";
		img.width = 16;
		img.height = 16;
		img.style.visibility = "hidden";
		img.style.cursor = "pointer";
		img.style.marginRight = "4px";
		img.addEventListener("click", () => {
			if (img.src == BuiltinIcons.visibleIcon) {
				img.src = BuiltinIcons.hiddenIcon;
				this.#applyListFilter({ hidden: true });
			} else {
				img.src = BuiltinIcons.visibleIcon;
				this.#applyListFilter({});
			}
		});
		img.addEventListener("mouseover", () => {
			img.style.backgroundColor = "#ddd";
		});
		img.addEventListener("mouseout", () => {
			img.style.backgroundColor = "";
		});
		layerListUiTopElem.appendChild(img);
	}

	#applyListFilter(mode) {
		//console.log("applyListFilter:",mode);
		if (mode.hidden) {
			this.#layerListOptions.hiddenFilter = true;
		} else {
			delete this.#layerListOptions.hiddenFilter;
		}
		this.#updateLayerTable();
	}

	// 公開するAPI
	setLayerListmessage(...params) {
		return this.#setLayerListmessage(...params);
	} //このメソッドの公開はオプション
	setLayerSpecificWebAppLaunchUiEnable(...params) {
		return this.#setLayerSpecificWebAppLaunchUiEnable(...params);
	} //このメソッドの公開はたいていの場合必須
	getLayersCustomizer = function () {
		// このメソッドの公開は必須
		var ans = this.#layersCustomizer;
		// console.log("getLayersCustomizer:",ans);
		return ans;
	}.bind(this);
}

export { SvgMapLayerUI };
