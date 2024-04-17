import { getSkin } from "./mojang";
import { loadImage } from "skia-canvas";
const prefix = process.env.NODE_ENV === "development" ? "http://localhost:5173" : "https://pfp.arcticbd.net";

async function generatePfp(username, ctx, type) {
	try {
		if (!username) {
			drawFailed(ctx);
			return;
		}

		const skinURL = await getSkin(username);
		const skinImage = await loadImage(skinURL);
		const shading = await loadImage(`${prefix}/20x20pshading.png`);
		const backdrop = await loadImage(`${prefix}/backdropshading.png`);

		ctx.drawImage(backdrop, 0, 0, 20, 20);

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

		ctx.drawImage(shading, 0, 0, 20, 20);
		if(type == "ban") {
			const banned = await loadImage(`${prefix}/banned_big.png`)
			ctx.globalAlpha = 0.4;
			ctx.drawImage(banned, 0, 0, 18.5, 18.5)
		} else if(type=='warn') {
			const warning = await loadImage(`${prefix}/warn.png`)
			ctx.globalAlpha = 0.4;
			ctx.drawImage(warning, 0, 0, 18.5, 18.5)
		} else if(type=='jail') {
			const jail = await loadImage(`${prefix}/jail.png`)
			ctx.globalAlpha = 0.9;
			ctx.drawImage(jail, 0, 0, 18.5, 20)
		} else if(type=='mute') {
			const mute = await loadImage(`${prefix}/mute.png`)
			ctx.globalAlpha = 0.8;
			ctx.drawImage(mute, 0, 0, 18.5, 20)
		} else if(type=="kick") {
			const kick = await loadImage(`${prefix}/kick.png`)
			ctx.globalAlpha = 0.6;
			ctx.drawImage(kick, 0, 0, 18.5, 20)
		}

	} catch (e) {
		await drawFailed(ctx);
	}
}

async function drawFailed(ctx) {
	const failed = await loadImage(`${prefix}/PFP/notFound.png`);
	const shading = await loadImage(`${prefix}/20x20pshading.png`);
	const backdrop = await loadImage(`${prefix}/backdropshading.png`);

	ctx.drawImage(backdrop, 0, 0, 20, 20);
	ctx.resetTransform();
	ctx.drawImage(failed, 0, 0, 300, 300);
	ctx.scale(16, 16);
	ctx.drawImage(shading, 0, 0, 20, 20);
}

export default generatePfp