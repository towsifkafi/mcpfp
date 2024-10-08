import { readdir } from "node:fs/promises";
import { getSkin, getNameMCSkin } from "./getSkin";
import { loadImage, SKRSContext2D, Image } from "@napi-rs/canvas";
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

(async() => {
	shading = await loadImage(`./assets/20x20pshading.png`);
	backdrop = await loadImage(`./assets/backdropshading.png`);
})()

cosmetics.forEach(async (file) => { available_props[file.split(".")[0]] = await loadImage(`assets/cosmetics/${file}`) })
overlayFiles.forEach(async (file) => { overlays[file.split(".")[0]] = await loadImage(`assets/overlays/${file}`) })

async function generatePfp(username: string, ctx: SKRSContext2D, { overlay = "normal", props = "", url = false, namemc = false }) {
	try {
		if (!username) {
			drawFailed(ctx);
			return;
		}
		
		let skinURL;

		if(url) {
			if(checkURL(username)) { skinURL = username }
				else throw new Error("Invalid URL")
		} else if(namemc) {
			skinURL = await getNameMCSkin(username)
		} else {
			skinURL = await getSkin(username)
		}

		let skinImage;
		try {
			skinImage = await loadImage(skinURL);
		} catch(err) {
			skinImage = await loadImage(`https://minotar.net/skin/${username}`);
		}

		await drawSkin(ctx, skinImage);

		let propsArray = props.split(",");
		propsArray = sortArrayBasedOnReference(Object.keys(available_props), propsArray)
		for(const prop of propsArray) {
			await drawProp(ctx, prop);
		}

		ctx.drawImage(shading, 0, 0, 20, 20);
        //ctx.drawImage(backdrop, 0, 0, 20, 20);

		if(overlay == "ban") {
			ctx.globalAlpha = 0.4;
			ctx.drawImage(overlays["ban"]!, 0, 0, 18.5, 18.5)
		} else if(overlay =='warn') {
			ctx.globalAlpha = 0.4;
			ctx.drawImage(overlays["warn"]!, 0, 0, 18.5, 18.5)
		} else if(overlay=='jail') {
			ctx.globalAlpha = 0.9;
			ctx.drawImage(overlays["jail"]!, 0, 0, 18.5, 20)
		} else if(overlay=='mute') {
			ctx.globalAlpha = 0.8;
			ctx.drawImage(overlays["mute"]!, 0, 0, 18.5, 20)
		} else if(overlay=="kick") {
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

async function drawProp(ctx: SKRSContext2D, propImage: string) {

	if(Object.keys(available_props).includes(propImage)) {
		const prop = available_props[propImage];
		await drawSkin(ctx, prop!);
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