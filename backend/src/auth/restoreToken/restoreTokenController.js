import "dotenv/config"
import redisClient from "#database/redis.js"

const RESTORE_RELOAD_INTERVAL = process.env.RESTORE_RELOAD_INTERVAL

class restoreTokenController {
    get = async restoreTokenID => {
        return await redisClient.get("restoreToken:" + restoreTokenID)
    }

    add = async (restoreTokenID, userID) => {
        await redisClient.setex(
            "restoreToken:" + restoreTokenID,
            parseInt(RESTORE_RELOAD_INTERVAL),
            userID
        )
    }

    delete = async restoreTokenID => {
        await redisClient.del("restoreToken:" + restoreTokenID)
    }
}

export default new restoreTokenController()
