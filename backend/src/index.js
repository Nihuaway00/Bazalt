import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { Server } from "socket.io"
import http from "http"
import sessionMiddleware from "#database/sessionConfig.js"
import { createRoutes } from "./routes.js"

const app = express()
const server = http.createServer(app)
const router = express.Router()

const PORT = process.env.PORT
const COOKIE_SECRET = process.env.COOKIE_SECRET
const CLIENT_URL = process.env.CLIENT_URL

const corsConfig = {
    origin: CLIENT_URL,
    credentials: true,
}

app.disable("x-powered-by")
app.use(cors(corsConfig))
app.use(express.json())
app.use(cookieParser(COOKIE_SECRET))
app.use(sessionMiddleware)
app.use(express.static("uploads"))
app.use(router)
//app.use(ErrorMiddleware)

app.get("/", (req, res) => {
    res.end("Backend of Bazalt has started")
})

const io = new Server(server, { cors: corsConfig })
createRoutes(router, io)
server.listen(PORT, async () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})
