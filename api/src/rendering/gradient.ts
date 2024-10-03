import { SKRSContext2D } from "@napi-rs/canvas";

function changeGradient(ctx: SKRSContext2D, colours = ["#00cdac", "#7338fc"]) {
	if(!colours.length) colours = ["#57cffa", "#387dfc"]
	const gradient = ctx.createLinearGradient(0, 18.75, 0, 0);

	let interval = 1;
	const decrement = 1 / (colours.length - 1);
	colours.forEach(colour => {
		gradient.addColorStop(interval, colour);
		interval -= decrement;
	})
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 18.75, 18.75);
}

export default changeGradient;
