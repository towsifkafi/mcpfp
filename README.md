# mcpfp-api

This is a modified fork of [MauritsWilke/mcpfp](https://github.com/MauritsWilke/mcpfp) to generate minecraft pfp using API

## Installation

Clone the repository from the command line
```bash
git clone https://github.com/towsifkafi/mcpfp.git
cd mcpfp
```
Then install the required the dependencies
```bash
npm install
``` 
You can start the dev server using
```bash
npm run dev
```

But if you want to run this API server in production, you have to build the server & you can use the `ecosystem.config.cjs` using pm2.
```bash
npm run build
```
```bash
pm2 start ecosystem.config.js
```