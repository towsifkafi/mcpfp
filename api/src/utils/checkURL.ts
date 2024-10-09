const allowed_domains = [
    "textures.minecraft.net", "namemc.com", "mineskin.eu", 
    "minotar.net", "crafatar.com", "mc-heads.net", "api.mineatar.io",
    "api.tydiumcraft.net"
]

function checkURL(url: string) {
    const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
    if(!allowed_domains.includes(domain)) throw new Error(`Domain ${domain} is not allowed`);
    return true;
}

export {
    checkURL
}