import client from "#database/redis.js"
class sessionController {
	bindUser = async (userID, sessionID) => {
		await client.sadd("user-session:" + userID, sessionID)
	}

	unbindUser = async (userID, sessionID) => {
		await client.srem("user-session:" + userID, sessionID)
	}

	getFromUserID = async (userID) => {
		return await client.smembers("user-session:" + userID)
	}

	getFromID = async (sessionID) => {
		const session = await client.get("session:" + sessionID)
		return JSON.parse(session)
	}

	delete = async (sessionID) => {
		await client.del("session:" + sessionID)
	}
}

export default new sessionController()
