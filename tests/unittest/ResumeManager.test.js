// License: (MPL v2)
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.
import { ResumeManager } from "@penguings/svgmapjs";
import { jest } from "@jest/globals";

const urlPatterns = [
	{
		description: "pure url",
		url: "/main.svg",
	},
	{
		description: "url + a query parameter.",
		url: "/main.svg?param=1",
	},
	{
		description: "url + multi query parameters.",
		url: "/main.svg?param=1&param2",
	},
	{
		description: "url + hash tag",
		url: "/main.svg#param=1",
	},
	{
		description: "url + hash tag(multi parameters)",
		url: "/main.svg#param=1&param2",
	},
];

describe("target ResumeManager.", () => {
	describe.each(urlPatterns)("check to $description", (pattern) => {
		let resumemanager;

		let mock_svgMapObject, mock_svgMapCustomLayersManager, mock_parseSVGfunc;
		let mock_localstorage;
		beforeAll(() => {
			mock_svgMapObject = {
				getSvgImagesProps: jest.fn().mockReturnValue({
					root: { Path: { location: { href: "aaa" } } },
				}),
				getSvgImages: jest.fn(),
				getRootLayersProps: jest.fn().mockReturnValue([]),
				getGeoViewBox: jest
					.fn()
					.mockReturnValue({ x: 0, y: 0, width: 0, height: 0 }),
			};
			mock_svgMapCustomLayersManager = jest.fn();
			mock_parseSVGfunc = jest.fn();

			resumemanager = new ResumeManager(
				mock_svgMapObject,
				mock_svgMapCustomLayersManager,
				mock_parseSVGfunc
			);
		});
		beforeEach(() => {
			window.history.pushState({}, "", pattern.url);
		});
		// ブラウザにかかわるところは専用のクラスを用いると試験しやすい
		it("check Resume", () => {
			//こういう書き方はできない
			//global.location.href = "http://nandatte.com"
			let dummy_documentElemnt;
			let dummy_symobls;

			let result = resumemanager.checkResume(
				dummy_documentElemnt,
				dummy_symobls
			);
			expect(result).toBe(undefined);
		});

		it("get PermanentLink", () => {
			let result = resumemanager.getBasicPermanentLink(false);
			const expected =
				new URL(window.location.pathname, window.location.origin).href +
				"#xywh=global:0.000000,0.000000,0.000000,0.000000";
			expect(result.href).toEqual(expected);
		});
	});
});
