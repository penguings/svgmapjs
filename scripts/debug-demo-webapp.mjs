import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();

const mimeTypes = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".svg": "image/svg+xml; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".map": "application/json; charset=utf-8",
};

function safeJoin(rootDir, requestPath) {
	const relPath = requestPath.replace(/^\/+/, "");
	const joined = path.join(rootDir, relPath);
	const normalizedRoot = path.resolve(rootDir) + path.sep;
	const normalizedJoined = path.resolve(joined);
	if (!normalizedJoined.startsWith(normalizedRoot)) {
		return null;
	}
	return normalizedJoined;
}

const server = http.createServer((req, res) => {
	try {
		const url = new URL(req.url || "/", "http://127.0.0.1");
		let pathname = decodeURIComponent(url.pathname);
		if (pathname.endsWith("/")) {
			pathname += "index.html";
		}
		const filePath = safeJoin(root, pathname);
		if (!filePath) {
			console.log("serve", 403, pathname, "->", "(blocked)");
			res.writeHead(403);
			res.end("forbidden");
			return;
		}
		fs.readFile(filePath, (err, data) => {
			if (err) {
				console.log("serve", 404, pathname, "->", filePath);
				res.writeHead(404);
				res.end("not found");
				return;
			}
			const ext = path.extname(filePath).toLowerCase();
			res.setHeader("Cache-Control", "no-store");
			res.writeHead(200, {
				"Content-Type": mimeTypes[ext] || "application/octet-stream",
			});
			res.end(data);
		});
	} catch (e) {
		res.writeHead(500);
		res.end(String(e));
	}
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const targetUrl = `http://127.0.0.1:${port}/docs/demo/`;

console.log("serve", targetUrl);

const browser = await chromium.launch();
const page = await browser.newPage();

page.on("console", (m) => console.log("console", m.type(), m.text()));
page.on("pageerror", (e) =>
	console.log("pageerror", e && e.stack ? e.stack : String(e)),
);

await page.goto(targetUrl, { waitUntil: "load" });
await page.waitForTimeout(3000);

const state = await page.evaluate(() => {
	const err = document.getElementById("error");
	const map = document.getElementById("mapcanvas");
	const errorVisible = err && getComputedStyle(err).display !== "none";
	return {
		errorVisible,
		errorText: errorVisible ? err.textContent : null,
		allSvgCount: document.querySelectorAll("svg").length,
		allObjectCount: document.querySelectorAll("object").length,
		allIframeCount: document.querySelectorAll("iframe").length,
		svgCount: document.querySelectorAll("#mapcanvas svg").length,
		objectCount: document.querySelectorAll("#mapcanvas object").length,
		iframeCount: document.querySelectorAll("#mapcanvas iframe").length,
		mapInnerHTMLHead: map ? map.innerHTML.slice(0, 800) : null,
	};
});

console.log("state", JSON.stringify(state, null, 2));

await browser.close();
server.close();
