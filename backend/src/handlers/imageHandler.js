import sharp from "sharp"

class ImageHandler {
	image

	constructor(data) {
		this.image = sharp(data)
	}

	static getMetadata = async (buffer) => {
		return await sharp(buffer).metadata()
	}

	resize = async (resize) => {
		return await this.image
			.resize(resize)
			.webp()
			.toBuffer()
	}
}

export default ImageHandler
