//import "dotenv/config";
//import session from "express-session";
//import redisStore from "connect-redis";
//import redisClient from "#database/redis.js";

//const socketSessionMiddleware = session({
//  secret: process.env.COOKIE_SECRET,
//  credentials: true,
//  name: "socSessionID",
//  resave: false,
//  httpOnly: false,
//  saveUninitialized: false,
//  cookie: {
//    maxAge: parseInt(process.env.SESSION_RELOAD_INTERVAL),
//  },
//  store: new redisStore({
//    client: redisClient,
//    prefix: "socket:",
//  }),
//});

//export default socketSessionMiddleware;