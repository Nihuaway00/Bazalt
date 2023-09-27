import client from "#database/redis.js"

class socketController {
	bindSession = async (sessionID, socketID) => {
		await client.sadd("session-socket:" + sessionID, socketID)
	}

	unbindSession = async (sessionID, socketID) => {
		await client.srem("session-socket:" + sessionID, socketID)
	}

	getFromSessionID = async (sessionID) => {
		return await client.smembers("session-socket:" + sessionID)
	}

	getFromID = async (socketID) => {
		return await client.get(socketID)
	}

	delete = async (socketID) => {
		await client.del(socketID)
	}
}

export default new socketController()