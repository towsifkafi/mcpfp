async function getSkin(username: string) {
	return `https://minotar.net/skin/${username}`
}

async function getSkinMojang(username: string) {
	if (!valid(username)) return Promise.reject(`${username} is an invalid username`);
	
	const UUID = await getUUID(username);
	const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${UUID}`);
	if (!response.ok) return Promise.reject(`Response returned statuscode ${response.status}`);
	const json = await response.json();
	const r = JSON.parse(atob(json.properties[0].value));
	console.log(r)
	
	return r.textures.SKIN.url;
}

async function getUUID(username: string) {
	if (!valid(username)) return Promise.reject(`${username} is an invalid username`);
	const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`)
	if (!response.ok) return Promise.reject(`${username} does not exist`);
	const json = await response.json();
	return json.id;
}

function valid(username: string) {
	return username.match(/^[a-z0-9_]{1,16}$/i);
}

export {
	getSkinMojang,
	getSkin,
	getUUID,
	valid
}
