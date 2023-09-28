import "dotenv/config"
import redis from "ioredis"

const url = process.env.REDIS_URL
const port = process.env.REDIS_PORT
const client = redis.createClient({ host: url, port: parseInt(port) })

client.on('error', err => {
	console.log("ERROR: redis\nMESSAGE: " + err.message)
	process.exit(1)
})

export default client