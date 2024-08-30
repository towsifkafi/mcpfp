import { getSkin } from "./mojang";
import { loadImage, Canvas } from "skia-canvas";

const available_props = ["batman", "crown", "labcoat", "rose"]

async function generatePfp(origin, username, ctx, overlay, data = false, flip = false, props = "") {
	console.log(origin)
	const prefix = origin
	try {
		if (!username) {
			drawFailed(origin, ctx);
			return;
		}
		
		let skinURL;
		if(data) {
			//console.log(username)
			skinURL = username
		} else {
			skinURL = await getSkin(username)
		}

		let skinImage;
		try {
			skinImage = await loadImage(skinURL);
		} catch(err) {
			skinImage = await loadImage(`https://minotar.net/skin/${username}`);
		}
		
		const shading = await loadImage(`${prefix}/20x20pshading.png`);
		const backdrop = await loadImage(`${prefix}/backdropshading.png`);

		await drawSkin(ctx, skinImage);

		let propsArray = props.split(",");
		propsArray = sortArrayBasedOnReference(available_props, propsArray)
		for(const prop of propsArray) {
			await drawProp(origin, ctx, prop);
		}

		ctx.drawImage(shading, 0, 0, 20, 20);

		if(overlay == "ban") {

			const banned = await loadImage(`${prefix}/banned_big.png`)
			
			ctx.globalAlpha = 0.4;
			ctx.drawImage(banned, 0, 0, 18.5, 18.5)

		} else if(overlay =='warn') {

			const warning = await loadImage(`${prefix}/warn.png`)

			ctx.globalAlpha = 0.4;
			ctx.drawImage(warning, 0, 0, 18.5, 18.5)

		} else if(overlay=='jail') {

			const jail = await loadImage(`${prefix}/jail.png`)
			
			ctx.globalAlpha = 0.9;
			ctx.drawImage(jail, 0, 0, 18.5, 20)

		} else if(overlay=='mute') {

			const mute = await loadImage(`${prefix}/mute.png`)
			
			ctx.globalAlpha = 0.8;
			ctx.drawImage(mute, 0, 0, 18.5, 20)

		} else if(overlay=="kick") {

			const kick = await loadImage(`${prefix}/kick.png`)
			
			ctx.globalAlpha = 0.6;
			ctx.drawImage(kick, 0, 0, 18.5, 20)

		}


		if(flip) {

		}

	} catch (e) {
		await drawFailed(ctx);
	}
}

async function drawSkin(ctx, skinImage) {
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

async function drawProp(origin, ctx, propImage) {

	if(available_props.includes(propImage)) {
		const prop = await loadImage(`${origin}/cosmetics/${propImage}.png`)
		await drawSkin(ctx, prop);
	}

}

async function drawFailed(origin, ctx) {
	
	const failed = await loadImage(`${prefix}/PFP/notFound.png`);
	const shading = await loadImage(`${prefix}/20x20pshading.png`);
	const backdrop = await loadImage(`${prefix}/backdropshading.png`);

	ctx.drawImage(backdrop, 0, 0, 20, 20);
	ctx.resetTransform();
	ctx.drawImage(failed, 0, 0, 300, 300);
	ctx.scale(16, 16);
	ctx.drawImage(shading, 0, 0, 20, 20);
}

function sortArrayBasedOnReference(arr1, arr2) {
    const indexMap = arr1.reduce((map, item, index) => {
        map[item] = index;
        return map;
    }, {});

    return arr2.slice().sort((a, b) => indexMap[a] - indexMap[b]);
}

export default generatePfp