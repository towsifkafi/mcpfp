<div align="center">
<img width="150" src="https://github.com/user-attachments/assets/59b82859-ccfa-4b06-ba7a-8160add8fdbf">
<br>

# `mcpfp-api`
</div>


This project is an API server designed to generate cute profile pictures from Minecraft skins. It's based on [**mcpfp**](https://github.com/MauritsWilke/mcpfp) by **MauritsWilke**, with additional features like overlays and cosmetics.

Also this project utilizes **🔥 Hono** and **🫓 Bun** along with [`@napi-rs/canvas`](https://www.npmjs.com/package/@napi-rs/canvas) (instead of skia-canvas) resulting in faster performance.

<div align="center">
<img width="130" src="https://github.com/user-attachments/assets/a4feaa87-09a2-424c-a5f2-36edae1f6a29">
<img width="130" src="https://github.com/user-attachments/assets/6a865eeb-db83-4926-90e2-d4c50b55e1da">
<img width="130" src="https://github.com/user-attachments/assets/75e5be95-57a6-4736-9662-6e91f1950a13">
<img width="130" src="https://github.com/user-attachments/assets/ea91189b-c948-4569-b4e1-88674fb86a38">
<img width="130" src="https://github.com/user-attachments/assets/a9432826-ec91-48d8-87de-af2c5f02dcc2">
<img width="130" src="https://github.com/user-attachments/assets/8b8a0103-3abc-47bf-9e94-8756e77ae438">
</div>

> You can try a public instance of this here: https://pfp.arcticbd.net

## Installation
**Make sure you have [Bun](https://bun.sh/) installed**. Install from: https://bun.sh/

Clone the repository from the command line:
```bash
git clone https://github.com/towsifkafi/mcpfp.git
cd mcpfp
```
Then install the required the dependencies:
```bash
bun install --cwd ./api
bun install --cwd ./web
``` 
Also, you need to build the static webpages before running the dev server:
```bash
bun run --cwd ./web build
```

Now you can start the dev server:
```bash
bun run --cwd ./api dev
```

But if you want to run this API server in production, you have to build the server & you can use the `pm2.config.js` using pm2.
```bash
pm2 start pm2.config.js
```
Or if you would like to use Docker:
```bash
docker-compose build
docker-compose up
```
## Contributing
Contributions are welcome! Please feel free to submit pull requests or issues.