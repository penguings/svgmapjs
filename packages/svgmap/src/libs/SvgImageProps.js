// Description:
// SvgImageProps Class for SVGMap.js
// Programmed by Satoru Takagi
//
// License: (MPL v2)
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
//
class SvgImageProps {
    

	#hashChangedByAppLayer = false; // #hashは#からスタートする文字列
	clearHashChangedFlag() {
		const ans = this.#hashChangedByAppLayer;
		this.#hashChangedByAppLayer = false;
		return ans;
	}
	get hash() {
		return new URL(this.Path, location).hash;
	}
	/**
	 * @description URLのハッシュを設定します
	 * @param {string} val - ハッシュとして追加したい文字列
	 */
	set hash(val) {
		if (!val || val == "") {
			// hashを消した場合・・
			this.#hashChangedByAppLayer = true;
			this.Path = this.#getPath(this.Path);
		} else {
			if (!val.startsWith("#")) {
				console.warn("hash should be startd with #");
				return;
			} else if (val == "#") {
				console.warn(
					"At least one string of characters in addition to the # is required."
				);
				return;
			}
			this.#hashChangedByAppLayer = val;
			this.Path = this.#getPath(this.Path) + val;
		}
	}

	/**
	 * @description pathWithFragmentから、パス部分だけを取り出します
	 * @param {string} pathWithFragment -フラグメントを含んでいるかもしれない文字列・プロトコルも存在している絶対URLでも相対パスwithフラグメントでもいい
	 */
	#getPath(pathWithFragment) {
		let path;
		const fidx = pathWithFragment.indexOf("#");
		if (fidx > -1) {
			// フラグメントが存在するかどうかを確認
			path = pathWithFragment.substring(0, fidx);
		} else {
			path = pathWithFragment; // フラグメントがない場合はそのままの文字列
		}
		return path;
	}
}

export { SvgImageProps };
