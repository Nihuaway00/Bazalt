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
	"video/mov",
	"file/docx",
	"file/md",
	"file/yml",
	"file/txt",
	"file/pptx",
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
				if (!supportedTypes.includes(file.type))
					throw ErrorHandler.BadRequest(
						"The files contain an unsupported format"
					)
				if (file.size > 1048576 * 2000)

					throw ErrorHandler.BadRequest("There is a huge file in files: " + file.size.toString())

				if (file.type.split("/")[0] === "image") {
					const metadata = await ImageHandler.getMetadata(file.buffer)
					if (Math.min(metadata.width, metadata.height) < 100)
						throw ErrorHandler.BadRequest(
							"Files contains a file with a resolution less than 100px"
						)
				}
			})

			next()
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
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

			console.log(encryptedFiles);

			const aes = new AesCryptoHandler()
			await aes.generateKeyFromData(key.toString(), "salt")

			const promiseFiles = encryptedFiles.map(async encrypted => {
				const eFile = new Uint8Array(encrypted.buffer)
				const decrypted = await aes.decrypt(
					eFile,
					new Uint8Array(iv.split(","))
				)

				const file = JSON.parse(decrypted)
				return {
					...encrypted,
					buffer: Buffer.from(file.data.split(",")),
					type: encrypted.mimetype
				}
			})
			Promise.all(promiseFiles).then(files => {
				req.files = files
				next()
			})
		} catch (e) {
			console.log(e.message)
			res.status(e.status).send(e.message)
		}
	}


}

export default FileMiddleware
