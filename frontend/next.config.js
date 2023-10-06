module.exports = {
	env: {
		BACKEND_URL: 'http://localhost:8000'
	},
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "127.0.0.1",
				port: "9000",
			},
		],
	},
}