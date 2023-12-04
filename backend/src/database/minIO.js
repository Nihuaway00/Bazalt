import "dotenv/config"
import { Client } from "minio"

const endPoint = process.env.MINIO_ENDPOINT
const port = process.env.MINIO_PORT
const useSSL = process.env.MINIO_USESSL
const accessKey = process.env.MINIO_ACCESSKEY
const secretKey = process.env.MINIO_SECRETKEY

if (!endPoint || !port || !useSSL || !accessKey || !secretKey) {
    console.log("config for minio is invalid")
    process.exit(1)
}

const client = new Client({
    endPoint,
    port: 1 * port,
    useSSL: "true" == useSSL,
    accessKey,
    secretKey,
})

export default client
