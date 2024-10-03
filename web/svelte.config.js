//import adapter from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-static';
import path from "path";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		//adapter: adapter({ out: 'build' }),
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: '../api/web',
			assets: '../api/web',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		alias: {
			"@components": "./src/lib/components",
			"@scripts": "./src/lib/scripts"
		},
	}
};

export default config;
