import md5 from "md5"
import fs from "fs"
import sharp from "sharp"

class FileFunction {
	path = (ID) => {
		const date = new Date().toISOString().split("T")[0].replace("-", "/")
		const path = md5(date + ID)
		const hash = md5(path)
		return `${hash.substring(0, 2)}/${hash.substring(2, 4)}/${hash}`
	}

	saveImage = (path, relativePath, image, sizes) => {
		sizes.map((size) => {
			const endPath = `${path}${size}x/${relativePath}`
			fs.mkdirSync(endPath, { recursive: true })

			sharp(image.buffer)
				.resize(size, size)
				.webp()
				.toFile(endPath + ".webp")
		})
	}
}

export default new FileFunction()
