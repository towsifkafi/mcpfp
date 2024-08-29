async function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.crossOrigin = "Anonymous";
		img.src = url
		img.onload = () => {
			resolve(img)
		}
		img.onerror = e => {
			reject(e)
		}
	})
}

async function mergeCanvases(canvases: HTMLCanvasElement[]) {
	const canvas = document.createElement("canvas");
	canvas.width = canvases[0].width;
	canvas.height = canvases[0].height;

	const ctx = canvas.getContext("2d");
	for (const c of canvases) {
		const imageVersion = new Image();
		await new Promise(r => {
			imageVersion.onload = r, imageVersion.src = c.toDataURL()
		})
		ctx?.drawImage(imageVersion, 0, 0)
	}

	return canvas
}

function generateQuery(data) {
	let queryString = '';
  
	// Loop through each object in the array
	data.forEach(obj => {
	  // Loop through each key-value pair in the object
	  Object.entries(obj).forEach(([key, value]) => {
		// Check if the value is not empty
		if (value !== undefined && value !== null && value !== '') {
		  // Append key-value pair to the query string
		  queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
		}
	  });
	});
  
	// Remove the trailing '&' character
	queryString = queryString.slice(0, -1);
  
	// Add '?' if query string is not empty
	if (queryString !== '') {
	  queryString = '?' + queryString;
	}
  
	return queryString;
  }

export {
	loadImage,
	mergeCanvases,
	generateQuery
}