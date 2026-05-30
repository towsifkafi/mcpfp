import { readdir } from "node:fs/promises";
import { getSkin, getNameMCSkin } from "./getSkin";
import { loadImage, SKRSContext2D, Image, createCanvas } from "@napi-rs/canvas";
import { checkURL } from "../utils/checkURL";

const available_props: { [key: string]: Image | null } = {
	batman: null, crown: null, labcoat: null, rose: null
};

const overlays: { [key: string]: Image | null } = {
	ban: null, warn: null,
	jail: null, mute: null,
	kick: null,
};

let shading: Image;
let backdrop: Image;

const overlayFiles = await readdir("./assets/overlays", { recursive: true });
const cosmetics = await readdir("./assets/cosmetics", { recursive: true });

(async () => {
	shading = await loadImage(`./assets/20x20pshading.png`);
	backdrop = await loadImage(`./assets/backdropshading.png`);
})()

cosmetics.forEach(async (file) => { available_props[file.split(".")[0]] = await loadImage(`assets/cosmetics/${file}`) })
overlayFiles.forEach(async (file) => { overlays[file.split(".")[0]] = await loadImage(`assets/overlays/${file}`) })

async function generatePfp(username: string, ctx: SKRSContext2D, { pfpType = "normal", overlay = "normal", props = "", url = false, namemc = false }) {
	try {
		if (!username) {
			drawFailed(ctx);
			return;
		}

		let skinURL;

		if (url) {
			if (checkURL(username)) { skinURL = username }
			else throw new Error("Invalid URL")
		} else if (namemc) {
			skinURL = await getNameMCSkin(username)
		} else {
			skinURL = await getSkin(username)
		}

		let skinImage;
		try {
			skinImage = await loadImage(skinURL);
		} catch (err) {
			skinImage = await loadImage(`https://minotar.net/skin/${username}`);
		}

		let drawAvatar: any = drawSkin
		if (pfpType == "chibi") drawAvatar = drawDropsSkin

		await drawAvatar(ctx, skinImage);


		let propsArray = props.split(",");
		propsArray = sortArrayBasedOnReference(Object.keys(available_props), propsArray)
		for (const prop of propsArray) {
			await drawProp(ctx, prop, drawAvatar);
		}

		if (pfpType == "normal") ctx.drawImage(shading, 0, 0, 20, 20);
		//ctx.drawImage(backdrop, 0, 0, 20, 20);

		if (overlay == "ban") {
			ctx.globalAlpha = 0.4;
			ctx.drawImage(overlays["ban"]!, 0, 0, 18.5, 18.5)
		} else if (overlay == 'warn') {
			ctx.globalAlpha = 0.4;
			ctx.drawImage(overlays["warn"]!, 0, 0, 18.5, 18.5)
		} else if (overlay == 'jail') {
			ctx.globalAlpha = 0.9;
			ctx.drawImage(overlays["jail"]!, 0, 0, 18.5, 20)
		} else if (overlay == 'mute') {
			ctx.globalAlpha = 0.8;
			ctx.drawImage(overlays["mute"]!, 0, 0, 18.5, 20)
		} else if (overlay == "kick") {
			ctx.globalAlpha = 0.6;
			ctx.drawImage(overlays["kick"]!, 0, 0, 18.5, 20)
		}

	} catch (e) {
		console.log(e)
		await drawFailed(ctx);
	}
}

async function drawSkin(ctx: SKRSContext2D, skinImage: Image) {
	if (skinImage.height === 32) {
		ctx.drawImage(skinImage, 8, 9, 7, 7, 8, 4, 7, 7); // Head (bottom layer)
		ctx.drawImage(skinImage, 5, 9, 3, 7, 5, 4, 3, 7); // Head Side (bottom layer)
		ctx.drawImage(skinImage, 44, 20, 3, 7, 12, 13, 3, 7); // Arm Right Side (bottom layer)
		ctx.drawImage(skinImage, 21, 20, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (bottom layer)
		ctx.drawImage(skinImage, 20, 21, 8, 8, 6, 12, 8, 8); // Chest Other (Bottom layer)
		ctx.drawImage(skinImage, 44, 20, 3, 7, 5, 13, 3, 7); // Arm Left Side (bottom layer)
		ctx.drawImage(skinImage, 40, 9, 7, 7, 8, 4, 7, 7); // Head (top layer)
		ctx.drawImage(skinImage, 33, 9, 3, 7, 5, 4, 3, 7); // Head Side (top layer)

	} else {
		// * BOTTOM LAYER
		ctx.drawImage(skinImage, 8, 9, 7, 7, 8, 4, 7, 7); // Head (bottom layer)
		ctx.drawImage(skinImage, 5, 9, 3, 7, 5, 4, 3, 7); // Head Side (bottom layer)
		ctx.drawImage(skinImage, 36, 52, 3, 7, 12, 13, 3, 7); // Arm Right Side (bottom layer)
		ctx.drawImage(skinImage, 21, 20, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (bottom layer)
		ctx.drawImage(skinImage, 20, 21, 8, 8, 6, 12, 8, 8); // Chest Other (Bottom layer)
		ctx.drawImage(skinImage, 44, 20, 3, 7, 5, 13, 3, 7); // Arm Left Side (bottom layer)

		// * TOP LAYER
		ctx.drawImage(skinImage, 40, 9, 7, 7, 8, 4, 7, 7); // Head (top layer)
		ctx.drawImage(skinImage, 33, 9, 3, 7, 5, 4, 3, 7); // Head Side (top layer)
		ctx.drawImage(skinImage, 52, 52, 3, 7, 12, 13, 3, 7); // Arm Right Side (top layer)
		ctx.drawImage(skinImage, 52, 36, 3, 7, 5, 13, 3, 7); // Arm Left Side (top layer)
		ctx.drawImage(skinImage, 20, 37, 8, 8, 6, 12, 8, 8); // Chest Other (top layer)
		ctx.drawImage(skinImage, 21, 36, 6, 1, 7, 11, 6, 1); // Chest Neck Small Line (top layer)
	}
}

const DROPS_GW = 28;
const DROPS_GH = 32;

function drawDropsSkin(ctx: SKRSContext2D, skinImage: Image) {
	const GW = DROPS_GW;
	const GH = DROPS_GH;
	const ov = skinImage.height === 64; // overlay support only for 64x64 skins

	// Draw skin onto a temporary 64x64 canvas to sample pixels
	const tmp = createCanvas(64, 64);
	const tctx = tmp.getContext('2d');
	tctx.imageSmoothingEnabled = false;
	tctx.drawImage(skinImage, 0, 0);
	const sd = tctx.getImageData(0, 0, 64, 64).data;

	type RGBA = [number, number, number, number];

	function px(x: number, y: number): RGBA {
		const i = (y * 64 + x) * 4;
		return [sd[i], sd[i + 1], sd[i + 2], sd[i + 3]];
	}

	function shade(c: RGBA, f: number): RGBA {
		return [Math.round(c[0] * f), Math.round(c[1] * f), Math.round(c[2] * f), c[3]];
	}

	// Output avatar canvas at native Drops resolution
	const av = createCanvas(GW, GH);
	const actx = av.getContext('2d');
	const aimg = actx.createImageData(GW, GH);

	function setChunk(cx: number, cy: number, c: RGBA) {
		if (cx < 0 || cx >= GW || cy < 0 || cy >= GH) return;
		const i = (cy * GW + cx) * 4;
		aimg.data[i] = c[0];
		aimg.data[i + 1] = c[1];
		aimg.data[i + 2] = c[2];
		aimg.data[i + 3] = c[3];
	}

	function getChunk(cx: number, cy: number): RGBA {
		const i = (cy * GW + cx) * 4;
		return [aimg.data[i], aimg.data[i + 1], aimg.data[i + 2], aimg.data[i + 3]];
	}

	function fillBase(c0: number, r0: number, c1: number, r1: number,
		sx0: number, sy0: number, sx1: number, sy1: number, factor?: number) {
		factor = factor || 1;
		const dw = c1 - c0, dh = r1 - r0;
		const sw = sx1 - sx0, sh = sy1 - sy0;
		for (let dy = 0; dy < dh; dy++)
			for (let dx = 0; dx < dw; dx++) {
				const sx = sx0 + Math.floor(dx * sw / dw);
				const sy = sy0 + Math.floor(dy * sh / dh);
				let p = px(sx, sy);
				if (factor !== 1) p = shade(p, factor);
				setChunk(c0 + dx, r0 + dy, p);
			}
	}

	function copyOverlay(c0: number, r0: number, c1: number, r1: number,
		sx0: number, sy0: number, sx1: number, sy1: number, factor?: number) {
		factor = factor || 1;
		const dw = c1 - c0, dh = r1 - r0;
		const sw = sx1 - sx0, sh = sy1 - sy0;
		for (let dy = 0; dy < dh; dy++)
			for (let dx = 0; dx < dw; dx++) {
				const sx = sx0 + Math.floor(dx * sw / dw);
				const sy = sy0 + Math.floor(dy * sh / dh);
				const p = px(sx, sy);
				if (p[3] === 0) continue;
				const c = factor !== 1 ? shade(p, factor) : p;
				setChunk(c0 + dx, r0 + dy, c);
			}
	}

	function fillFaceSquish(c0: number, r0: number, _c1: number, r1: number,
		sx0: number, sy0: number, _sx1: number, sy1: number, overlayMode: boolean) {
		// 8 src cols 14 dst with widths [2,2,2,1,1,2,2,2] (edges keep 2x scale)
		const colWidths = [2, 2, 2, 1, 1, 2, 2, 2];
		const dh = r1 - r0, sh = sy1 - sy0;
		let dx = 0;
		for (let sxOff = 0; sxOff < 8; sxOff++) {
			const w = colWidths[sxOff];
			for (let dy = 0; dy < dh; dy++) {
				const sy = sy0 + Math.floor(dy * sh / dh);
				const sx = sx0 + sxOff;
				const p = px(sx, sy);
				if (overlayMode && p[3] === 0) continue;
				for (let i = 0; i < w; i++) {
					setChunk(c0 + dx + i, r0 + dy, p);
				}
			}
			dx += w;
		}
	}

	function shadeOutline(c0: number, r0: number, c1: number, r1: number, factor?: number) {
		factor = factor || 0.7;
		for (let x = c0; x < c1; x++) {
			let c = getChunk(x, r0);
			setChunk(x, r0, shade(c, factor));
			c = getChunk(x, r1 - 1);
			setChunk(x, r1 - 1, shade(c, factor));
		}
		for (let y = r0 + 1; y < r1 - 1; y++) {
			let c = getChunk(c0, y);
			setChunk(c0, y, shade(c, factor));
			c = getChunk(c1 - 1, y);
			setChunk(c1 - 1, y, shade(c, factor));
		}
	}

	// === BASE LAYERS ===
	fillFaceSquish(2, 5, 16, 21, 8, 8, 16, 16, false);           // FACE
	fillBase(16, 5, 24, 21, 16, 8, 24, 16, 0.78);                // HEAD SIDE base + depth shade
	fillBase(6, 21, 17, 25, 20, 20, 28, 32);                     // BODY
	// ARM L
	fillBase(3, 21, 6, 25, 44, 20, 48, 31);
	fillBase(3, 25, 6, 26, 44, 31, 48, 32);
	// ARM R
	fillBase(17, 21, 24, 25, 44, 20, 48, 31);
	fillBase(17, 25, 24, 26, 44, 31, 48, 32);
	// ARM R depth shade 3 rightmost cols
	for (let cy = 21; cy < 26; cy++)
		for (let cx = 21; cx < 24; cx++) {
			const c = getChunk(cx, cy);
			setChunk(cx, cy, shade(c, 0.88));
		}
	// LEG L
	fillBase(6, 25, 12, 27, 4, 20, 8, 31);
	fillBase(6, 27, 12, 28, 4, 31, 8, 32);
	// LEG R
	fillBase(12, 25, 17, 27, 4, 20, 8, 31);
	fillBase(12, 27, 17, 28, 4, 31, 8, 32);
	// LEG SIDE depth
	fillBase(17, 26, 19, 27, 4, 20, 8, 31, 0.82);
	fillBase(17, 27, 19, 28, 4, 31, 8, 32, 0.82);

	// === OUTLINES (on base only) ===
	shadeOutline(2, 5, 16, 21);
	shadeOutline(16, 5, 24, 21);
	shadeOutline(3, 21, 6, 26);
	shadeOutline(17, 21, 24, 26);
	shadeOutline(6, 25, 12, 28);
	shadeOutline(12, 25, 17, 28);

	// === OVERLAYS (64x64 skins only) ===
	if (ov) {
		fillFaceSquish(2, 5, 16, 21, 40, 8, 48, 16, true);       // face overlay (squish-aligned)
		copyOverlay(17, 5, 25, 21, 48, 8, 56, 16, 0.78);         // side overlay shifted +1 right, depth-shaded
	}

	// Commit pixel data and draw the Drops avatar onto the main context
	actx.putImageData(aimg, 0, 0);

	// Scale the 28x32 avatar to fit within the 18.75x18.75 logical canvas
	const CANVAS_SIZE = 18.75;
	const scale = Math.min(CANVAS_SIZE / GW, CANVAS_SIZE / GH);
	const destW = GW * scale;
	const destH = GH * scale;
	const offsetX = (CANVAS_SIZE - destW) / 2;
	const offsetY = CANVAS_SIZE - destH; // align to bottom

	// @ts-ignore - Canvas object is compatible with drawImage
	ctx.drawImage(av, 0, 0, GW, GH, offsetX + 0.5, offsetY, destW, destH);
}

async function drawProp(ctx: SKRSContext2D, propImage: string, drawAvatar: Function) {

	if (Object.keys(available_props).includes(propImage)) {
		const prop = available_props[propImage];
		await drawAvatar(ctx, prop!);
	}

}

async function drawFailed(ctx: SKRSContext2D) {

	const failed = await loadImage(`assets/notFound.png`);
	const shading = await loadImage(`assets/20x20pshading.png`);
	const backdrop = await loadImage(`assets/backdropshading.png`);

	ctx.drawImage(backdrop, 0, 0, 20, 20);
	ctx.resetTransform();
	ctx.drawImage(failed, 0, 0, 300, 300);
	ctx.scale(16, 16);
	ctx.drawImage(shading, 0, 0, 20, 20);
}

function sortArrayBasedOnReference(arr1: any[], arr2: any[]) {
	const indexMap = arr1.reduce((map, item, index) => {
		map[item] = index;
		return map;
	}, {});

	return arr2.slice().sort((a, b) => indexMap[a] - indexMap[b]);
}

export default generatePfp