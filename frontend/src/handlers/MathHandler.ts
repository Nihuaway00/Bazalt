export class MathHandler{
    static isNumSimple = (num: number) => {
        for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
            if (num % i === 0) return false
        }
        return num > 1
    }

    static getPrimitiveRoot = (A: number, B: number, P: number) => {
        // @ts-ignore
        let next: number = 0
        let prev: number = A % P

        for (let i = 1; i < B; i++) {
            next = (prev * A) % P
            prev = next
        }

        return next
    }

    static getRandomInt = (min: number, max: number) => {
        if (min < 0) min = 0
        return Math.floor(Math.random() * (min + max - 1)) + min
    }
}