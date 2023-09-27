/* eslint-disable no-undef */
import "dotenv/config"
import session from "express-session"
import redisStore from "connect-redis"
import redisClient from "#database/redis.js"

const sessionMiddleware = session({
	secret: process.env.COOKIE_SECRET,
	credentials: true,
	name: "sessionID",
	resave: false,
	httpOnly: false,
	saveUninitialized: false,
	cookie: {
		maxAge: parseInt(process.env.SESSION_RELOAD_INTERVAL),
	},
	store: new redisStore({
		client: redisClient,
		prefix: "session:",
	}),
})





export default sessionMiddleware