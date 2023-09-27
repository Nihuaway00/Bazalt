
class MathHandler {
	static isNumSimple = (num) => {
		for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
			if (num % i === 0) return false
		}
		return num > 1
	}

	static getPrimitiveRoot = (A, B, P) => {
		let next = 0
		let prev = A % P

		for (let i = 1; i < B; i++) {
			next = (prev * A) % P
			prev = next
		}

		return next
	}

	static getRandomInt = (min, max) => {
		if (min < 0) min = 0
		return Math.floor(Math.random() * (min + max - 1)) + min
	}
}

export default MathHandler
