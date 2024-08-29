module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		// First application
		{
			name: 'mcpfp-api', // name of the process in PM2
			script: 'build/index.js',
			env_production: {
				NODE_ENV: 'production',
				PORT: 3000 // port the app will be launched on
			}
		}
	],
};
