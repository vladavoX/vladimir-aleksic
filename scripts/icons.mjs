// Regenerates every icon in public/ from public/favicon.svg, plus the Open
// Graph card from scripts/og.html. There is no ImageMagick and no sharp here,
// so headless Chrome does the rasterising and the .ico container is written by
// hand — a PNG-payload ICO is read by every browser that still asks for one.
//
//   node scripts/icons.mjs
//
// Idempotent for the icons, and nothing is left behind. The OG card is the one
// exception: og.html pulls JetBrains Mono from Google Fonts, so a run without
// network access still succeeds but commits a card typeset in the fallback
// monospace. Eyeball public/og.png after regenerating.

import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const CHROME =
	process.env.CHROME ??
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = join(root, "public");
const scriptsDir = join(root, "scripts");

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const PNG_IEND = Buffer.from([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);

/** Parses a PNG header, and refuses anything that is not a complete file. */
function readPng(file) {
	const bytes = readFileSync(file);
	if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
		throw new Error(`${file}: not a PNG`);
	}
	if (!bytes.subarray(-12).equals(PNG_IEND)) {
		throw new Error(`${file}: truncated PNG (no IEND)`);
	}
	return {
		bytes,
		width: bytes.readUInt32BE(16),
		height: bytes.readUInt32BE(20),
	};
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chrome 151 writes the screenshot and then keeps the process alive, so poll
 * for the file instead of waiting on exit. A stable byte count is not enough
 * evidence — the 50 KB og.png can land in more than one write, and two equal
 * samples across a quiet 150 ms would accept a half-written file — so wait for
 * the IEND trailer that says the encoder is done.
 */
async function waitForCompletePng(file, timeoutMs = 45_000) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		await sleep(150);
		try {
			const bytes = readFileSync(file);
			if (bytes.length > 12 && bytes.subarray(-12).equals(PNG_IEND)) return;
		} catch {
			// Not created yet, or being rewritten under us; try again.
		}
	}
	throw new Error(`timed out waiting for ${file}`);
}

/** Chrome forks renderer and GPU helpers, so take the whole group down. */
async function killTree(child) {
	const exited = once(child, "exit").catch(() => {});
	// spawn never got off the ground, so there is no group to signal and
	// `-undefined` would only throw.
	if (child.pid === undefined) return;
	try {
		process.kill(-child.pid, "SIGKILL");
	} catch {
		child.kill("SIGKILL");
	}
	await exited;
	// The helpers unlink profile lockfiles on their way out; give them a beat so
	// the temp directory is actually removable afterwards.
	await sleep(250);
}

async function screenshot({ page, out, width, height, timeBudgetMs = 4000 }) {
	rmSync(out, { force: true });
	// A fresh profile per launch: Chrome is taken down with SIGKILL, which leaves
	// the singleton lock behind, and a reused profile directory can make the next
	// launch bail out instead of screenshotting.
	const profile = mkdtempSync(join(work, "chrome-profile-"));
	const child = spawn(
		CHROME,
		[
			"--headless",
			"--disable-gpu",
			"--hide-scrollbars",
			"--force-device-scale-factor=1",
			"--no-first-run",
			"--no-default-browser-check",
			`--virtual-time-budget=${timeBudgetMs}`,
			`--user-data-dir=${profile}`,
			`--window-size=${width},${height}`,
			`--screenshot=${out}`,
			`file://${page}`,
		],
		{ stdio: "ignore", detached: true },
	);
	// Nothing listens for 'error' otherwise, and an unspawnable binary — no
	// Chrome at CHROME, wrong path on a non-mac box — would raise it as an
	// uncaught exception that skips the temp-directory cleanup below.
	const spawnFailed = once(child, "error").then(([error]) => {
		throw new Error(`cannot run Chrome at ${CHROME}: ${error.message}`);
	});
	spawnFailed.catch(() => {});
	try {
		await Promise.race([waitForCompletePng(out), spawnFailed]);
	} finally {
		await killTree(child);
	}

	const png = readPng(out);
	if (png.width !== width || png.height !== height) {
		throw new Error(
			`${out}: expected ${width}x${height}, got ${png.width}x${png.height}`,
		);
	}
	return png;
}

/**
 * Wraps the monogram in a page exactly size x size with no margin. `inset` is
 * the safe-area padding as a fraction per side, for the Android maskable icon.
 */
function wrapperHtml(svg, size, inset = 0) {
	const mark = size - 2 * Math.round(size * inset);
	return `<!DOCTYPE html>
<meta charset="utf-8">
<style>
html,body{margin:0;padding:0;overflow:hidden;width:${size}px;height:${size}px;background:#000}
body{display:flex;align-items:center;justify-content:center}
svg{display:block;width:${mark}px;height:${mark}px}
</style>
${svg}
`;
}

/** ICONDIR + one ICONDIRENTRY per image, then the PNG payloads themselves. */
function buildIco(pngs) {
	const header = Buffer.alloc(6 + 16 * pngs.length);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(pngs.length, 4); // image count

	let offset = header.length;
	for (const [index, png] of pngs.entries()) {
		const entry = 6 + 16 * index;
		header.writeUInt8(png.width >= 256 ? 0 : png.width, entry);
		header.writeUInt8(png.height >= 256 ? 0 : png.height, entry + 1);
		header.writeUInt8(0, entry + 2); // palette size, 0 for truecolour
		header.writeUInt8(0, entry + 3); // reserved
		header.writeUInt16LE(1, entry + 4); // colour planes
		header.writeUInt16LE(32, entry + 6); // bits per pixel
		header.writeUInt32LE(png.bytes.length, entry + 8);
		header.writeUInt32LE(offset, entry + 12);
		offset += png.bytes.length;
	}

	return Buffer.concat([header, ...pngs.map((png) => png.bytes)]);
}

const work = mkdtempSync(join(tmpdir(), "va-icons-"));
try {
	const svg = readFileSync(join(publicDir, "favicon.svg"), "utf8");

	// Loaded as an image the SVG is parsed as XML, where "--" inside a comment is
	// a hard error — easy to reintroduce the moment you mention a CSS custom
	// property, and it fails as a silently blank icon.
	for (const [, body] of svg.matchAll(/<!--([\s\S]*?)-->/g)) {
		if (body.includes("--")) {
			throw new Error("public/favicon.svg: '--' inside an XML comment");
		}
	}

	// The .ico sizes are rendered but not kept as standalone files.
	const icoSizes = [16, 32, 48];
	const pngTargets = [
		{ size: 180, file: "apple-touch-icon.png" },
		{ size: 192, file: "icon-192.png" },
		{ size: 512, file: "icon-512.png" },
	];

	const rendered = new Map();
	for (const size of [...icoSizes, ...pngTargets.map((t) => t.size)]) {
		const page = join(work, `mark-${size}.html`);
		writeFileSync(page, wrapperHtml(svg, size));
		const out = join(work, `mark-${size}.png`);
		rendered.set(size, await screenshot({ page, out, width: size, height: size }));
		console.log(`rendered ${size}x${size}`);
	}

	for (const { size, file } of pngTargets) {
		writeFileSync(join(publicDir, file), rendered.get(size).bytes);
		console.log(`wrote public/${file}`);
	}

	// Android masks the icon to an arbitrary shape, so the mark keeps ~20% clear
	// on every side.
	const maskablePage = join(work, "maskable.html");
	writeFileSync(maskablePage, wrapperHtml(svg, 512, 0.2));
	const maskable = await screenshot({
		page: maskablePage,
		out: join(work, "maskable.png"),
		width: 512,
		height: 512,
	});
	writeFileSync(join(publicDir, "icon-maskable-512.png"), maskable.bytes);
	console.log("wrote public/icon-maskable-512.png");

	const ico = buildIco(icoSizes.map((size) => rendered.get(size)));
	writeFileSync(join(publicDir, "favicon.ico"), ico);
	console.log(`wrote public/favicon.ico (${icoSizes.join(" + ")})`);

	const og = await screenshot({
		page: join(scriptsDir, "og.html"),
		out: join(work, "og.png"),
		width: 1200,
		height: 630,
		// og.html pulls JetBrains Mono over the network; the budget lets virtual
		// time run on until that has settled.
		timeBudgetMs: 10_000,
	});
	writeFileSync(join(publicDir, "og.png"), og.bytes);
	console.log("wrote public/og.png (1200x630)");
} finally {
	// Chrome can still be unlinking profile files as we tear the directory down.
	for (let attempt = 0; ; attempt++) {
		try {
			rmSync(work, { recursive: true, force: true });
			break;
		} catch (error) {
			if (attempt === 9) throw error;
			await sleep(300);
		}
	}
}
