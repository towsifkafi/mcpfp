import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'

import { createCanvas } from "@napi-rs/canvas";

import generatePfp from "./rendering/generateProfile";
import changeGradient from './rendering/gradient';

import { showRoutes } from 'hono/dev';

const app = new Hono()

app.use(logger())

app.use('/*', serveStatic({ root: './web' }))

app.get('/api/pfp/:overlay/:file', async (c) => {

    const file = c.req.param('file')
    const overlay = c.req.param('overlay')

    const hasExtension = file.includes('.');
    let format = hasExtension ? file.split('.').pop() : 'png'; // Default to png if no extension
    if(!["png","jpg","webp"].includes(format!)) format = "png";

    let username = hasExtension ? file.split('.')[0] : file;
    if(!username.length) username = "Steve"

    let gradient = c.req.query('gradient')
    let noBackground = c.req.query('no-background') == "true" ? true : false
    let data = c.req.query('data')
    let props = c.req.query('props')
    let namemc = c.req.query('namemc') == "true" ? true : false

    //let scale = parseInt(c.req.query('scale')!) || 1;
    //scale = scale > 16 ? 16 : scale < 1 ? 1 : scale;
    
    const canvas = createCanvas(300, 300);
    const ctx = canvas.getContext("2d");
    ctx.scale(16, 16)
    ctx.imageSmoothingEnabled = false;

    if(!noBackground) changeGradient(ctx, gradient ? gradient.split('-').map(f => `#${f}`) : []);

    await generatePfp(data || username, ctx, { 
        overlay, 
        props,
        data: data ? true : false,
        namemc
    });
    
    let bufferFormat = `image/${format === 'jpg' ? 'jpeg' : format}`;
    // @ts-ignore
    let imageBuffer = canvas.toBuffer(bufferFormat, { quality: 100 });
    return c.body(imageBuffer, 200, {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=86400, public'
    });

})

const port = process.env.PORT || 9002;
console.log(`Server is running on port ${port}`)

showRoutes(app)

export default {
    port,
    fetch: app.fetch,
}
