import ErrorHandler from "#errorHandler"
import ImageHandler from "#handlers/imageHandler.js"
import { AesCryptoHandler } from "#handlers/cryptoHandler.js"

const supportedTypes = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"video/mp4",
	"video/webm",
	"video/mov"
]

class FileMiddleware {
	static check = async (req, res, next) => {
		try {
			const files = req.files

			if (!files) {
				next()
				return
			}

			files.map(async file => {
				console.log(file)

				if (!supportedTypes.includes(file.mimetype))
					throw ErrorHandler.BadRequest(
						"The files contain an unsupported format"
					)
				if (file.size > 1048576)
					throw ErrorHandler.BadRequest("There is a huge file in files")

				if (file.mimetype.split("/")[0] === "image") {
					const metadata = await ImageHandler.getMetadata(file.buffer)
					if (Math.min(metadata.width, metadata.height) < 100)
						throw ErrorHandler.BadRequest(
							"Files contains a file with a resolution less than 100px"
						)
				}
			})

			next()
		} catch (e) {
			next(e)
		}
	}

	static decrypt = async (req, res, next) => {
		try {
			const encryptedFiles = req.files
			const { iv } = req.body
			const { key } = req.session

			if (!encryptedFiles) {
				next()
				return
			}

			const aes = new AesCryptoHandler()
			await aes.generateKeyFromData(key.toString(), "salt")

			const promiseFiles = encryptedFiles.map(async encrypted => {
				const eBuffer = new Uint8Array(encrypted.buffer)
				const decrypted = await aes.decrypt(
					eBuffer,
					new Uint8Array(iv.split(","))
				)

				const file = JSON.parse(decrypted)
				return {
					mimetype: file.mimetype,
					size: file.size,
					buffer: Buffer.from(file.bufferStr.split(","))
				}
			})

			Promise.all(promiseFiles).then(files => {
				req.files = files
				next()
			})
		} catch (e) {
			next(e)
		}
	}


}

export default FileMiddleware
