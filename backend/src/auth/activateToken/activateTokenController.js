import "dotenv/config"
import redisClient from "#database/redis.js"

const ACTIVATE_RELOAD_INTERVAL = process.env.ACTIVATE_RELOAD_INTERVAL

class activateTokenController {
    get = async activateTokenID => {
        return await redisClient.get("activateToken:" + activateTokenID)
    }

    add = async (activateTokenID, userID) => {
        await redisClient.setex(
            "activateToken:" + activateTokenID,
            parseInt(ACTIVATE_RELOAD_INTERVAL),
            userID
        )
    }

    delete = async activateTokenID => {
        await redisClient.del("activateToken:" + activateTokenID)
    }
}

export default new activateTokenController()
