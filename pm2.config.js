module.exports = {
	name: "mcpfp-api", 
	script: "src/index.ts", 
	interpreter: "/usr/bin/bun",
	cwd: "./api",
	env: {
		NODE_ENV: "development",
		PORT: "9002"
	}
};