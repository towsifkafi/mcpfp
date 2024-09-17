import generatePfp from "$lib/rendering/generateProfile";
import changeGradient from "$lib/rendering/gradient";
import { Canvas } from "skia-canvas";
import { json } from '@sveltejs/kit';

export async function GET({ params, url }) {
	let username = params.username;
	if (!username) {
		return json({
			status: 400,
			headers: {
				"Content-Type": "application/json"
			},
			body: {
				error: "Missing username"
			}

		})
	}

	try {

		const origin = `http://${url.host}`
		console.log(url)

		const searchParams = url.searchParams;
		const data = searchParams.get("data");
		const gradient = searchParams.get("gradient");
		let nobg = searchParams.get("no-background");
		let flip = searchParams.get("flip");

		const overlay = params.type
		const colours = gradient ? gradient.split("-").filter(v => v !== "").map(colour => `#${colour}`) : null;

		let props = searchParams.get("props");

		const canvas = new Canvas(300, 300);
		const ctx = canvas.getContext("2d");
		ctx.scale(16, 16)
		ctx.imageSmoothingEnabled = false;

		if(nobg !== "true") changeGradient(ctx, colours)
		if(flip === "true") flip = true
		if(!props) props = "" 

		if(data) {
			await generatePfp(origin, data, ctx, overlay, true, flip, props);
		} else {
			await generatePfp(origin, username, ctx, overlay, false, flip, props);
		}

		const dataURL = await canvas.png;
		//console.log(dataURL)
		
		console.log(username)
        return new Response(dataURL);
		

	} catch (e) {
		console.log(e)
		return json({
			status: 400,
			headers: {
				"Content-Type": "application/json"
			},
			body: {
				message: "oops"
			}
		})
	}
}