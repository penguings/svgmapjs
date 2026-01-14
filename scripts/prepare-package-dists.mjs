import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const packagesRoot = path.join(repoRoot, "packages");

async function listPackageDirs() {
	const dirs = [];
	dirs.push(path.join(packagesRoot, "svgmap"));

	const extensionsRoot = path.join(packagesRoot, "extensions");
	let extensionEntries = [];
	try {
		extensionEntries = await fs.readdir(extensionsRoot, {
			withFileTypes: true,
		});
	} catch {
		return dirs;
	}
	for (const ent of extensionEntries) {
		if (ent.isDirectory()) {
			dirs.push(path.join(extensionsRoot, ent.name));
		}
	}
	return dirs;
}

function toPosix(p) {
	return p.replace(/\\/g, "/");
}

async function ensureDir(dirPath) {
	await fs.mkdir(dirPath, { recursive: true });
}

async function writeFileIfChanged(filePath, content) {
	let current = null;
	try {
		current = await fs.readFile(filePath, "utf8");
	} catch {
		// ignore
	}
	if (current === content) {
		return;
	}
	await ensureDir(path.dirname(filePath));
	await fs.writeFile(filePath, content, "utf8");
}

async function generateDistProxiesForPackage(packageDir) {
	const packageJsonPath = path.join(packageDir, "package.json");
	let pkg;
	try {
		pkg = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
	} catch {
		return;
	}

	const exportsMap = pkg.exports;
	if (!exportsMap || typeof exportsMap !== "object") {
		return;
	}

	for (const exportKey of Object.keys(exportsMap)) {
		const target = exportsMap[exportKey];
		if (typeof target !== "string") {
			continue;
		}
		if (!target.startsWith("./dist/")) {
			continue;
		}
		const distRel = target.slice(2); // remove leading "./"
		const srcRel = target.replace("./dist/", "./src/").slice(2);
		const distAbs = path.join(packageDir, distRel);
		const srcAbs = path.join(packageDir, srcRel);

		const importRel = toPosix(path.relative(path.dirname(distAbs), srcAbs));
		const importSpec = importRel.startsWith(".") ? importRel : `./${importRel}`;
		const content = `export * from "${importSpec}";\n`;
		await writeFileIfChanged(distAbs, content);
	}
}

async function main() {
	const packageDirs = await listPackageDirs();
	for (const pkgDir of packageDirs) {
		await ensureDir(path.join(pkgDir, "dist"));
		await generateDistProxiesForPackage(pkgDir);
	}
}

await main();
