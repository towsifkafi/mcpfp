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

		const searchParams = url.searchParams;
		const data = searchParams.get("data");
		const type = params.type
		const gradient = searchParams.get("gradient");
		const colours = gradient ? gradient.split("-").filter(v => v !== "").map(colour => `#${colour}`) : null;

		const canvas = new Canvas(300, 300);
		const ctx = canvas.getContext("2d");
		ctx.scale(16, 16)
		ctx.imageSmoothingEnabled = false;

		changeGradient(ctx, colours)
		if(data) {
			await generatePfp(data, ctx, type, true);
		} else {
			await generatePfp(username, ctx, type);
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