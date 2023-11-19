import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import ErrorHandler from "#errorHandler"
import UserController from "#user/userController.js"
import { EmailService } from "#email/emailService.js"
import PassController from "#password/passwordController.js"
import SessionController from "#session/sessionController.js"
import SocketController from "#socket/socketController.js"
import RestoreTokenController from "#restoreToken/restoreTokenController.js"
import ActivateTokenController from "#activateToken/activateTokenController.js"

import { HmacCryptoHandler } from "#crypto/HmacCipher.js"
import { RsaCryptoHandler } from "#crypto/RsaCipher.js"
import MathHandler from "#handlers/mathHandler.js"

const ACTIVATE_SECRET_KEY = process.env.ACTIVATE_SECRET_KEY
const ACTIVATE_RELOAD_INTERVAL = process.env.ACTIVATE_RELOAD_INTERVAL
const RESTORE_SECRET_KEY = process.env.RESTORE_SECRET_KEY
const RESTORE_RELOAD_INTERVAL = process.env.RESTORE_RELOAD_INTERVAL

export class AuthService {
	static async login(req, res, next) {
		try {
			const { email, pass } = req.body
			const session = req.session
			if (!email || !pass) throw ErrorHandler.BadRequest("invalid input data")

			if (session.key)
				throw ErrorHandler.BadRequest("You`re already logged in")
			const userSnap = await UserController.getFromEmail(email)
			if (!userSnap?.exists())
				throw ErrorHandler.BadRequest("This user isn't exist")

			if (!userSnap.data().activated)
				throw ErrorHandler.Forbidden("This account not activated")


			// START VERIFY SECTION
			const {
				pubNum,
				decryptKeyJwk,
				HMACKeyJwk,
				G,
				P,
				publicNumSignatureEncrypted,
			} = req.body

			const rsa = new RsaCryptoHandler()
			await rsa.importDecryptKey("jwk", decryptKeyJwk)
			const publicNumSignature = await rsa.decrypt(new Uint8Array(publicNumSignatureEncrypted.split(",")))


			const hmac = new HmacCryptoHandler()
			await hmac.import("jwk", HMACKeyJwk)
			const verified = await hmac.verify(
				publicNumSignature,
				pubNum
			)

			if (!verified) throw new ErrorHandler.BadRequest()

			const server_prvNum = MathHandler.getRandomInt(10 ** 3, 10 ** 4)
			const server_pubNum = BigInt(G) ** BigInt(server_prvNum) % BigInt(P)
			const key = (
				BigInt(pubNum) ** BigInt(server_prvNum) %
				BigInt(P)
			).toString()

			req.session.key = key

			// END VERIFY SECTION

			const userID = userSnap.id
			const passSnap = await PassController.getFromUserID(userID)
			const passVerified = bcrypt.compareSync(pass, passSnap.data().value)
			if (!passVerified) throw ErrorHandler.BadRequest("Password is incorrect")

			req.session.userID = userID
			req.session.save()

			await SessionController.bindUser(userID, session.id)

			res.send({
				user: { ...userSnap.data(), _id: userSnap.id },
				sessionID: req.session.id,
				server_pubNum: server_pubNum.toString()
			})
		} catch (e) {
			next(e)
		}
	}

	static async refresh(req, res, next) {
		try {
			const { userID } = req.session
			const userSnap = await UserController.getFromID(userID)

			res.send({ user: { ...userSnap.data(), _id: userSnap.id } })
		} catch (e) {
			next(e)
		}
	}

	static async registration(req, res, next) {
		try {
			const { name, email, pass } = req.body
			if (!name || !email || !pass)
				throw ErrorHandler.BadRequest("invalid input data")
			if (!email.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/))
				throw ErrorHandler.BadRequest("Email does not match requirements")
			if (!pass.match(/(?=.*[0-9])(?=.*[a-z])[0-9a-zA-Z!@#$%^&*]{6,}/))
				throw ErrorHandler.BadRequest("Password does not match requirements")

			const userCandidate = await UserController.getFromEmail(email)
			if (userCandidate?.exists())
				throw ErrorHandler.BadRequest("Email already exist")

			if (req.session?.userID)
				throw ErrorHandler.BadRequest("You`re already authorized")

			//add user to db
			const userSnap = await UserController.add(name, email, null)

			//hash pass and add to db
			const hashPass = bcrypt.hashSync(pass, 3)
			await PassController.add(hashPass, userSnap.id)

			const activeToken = jwt.sign(
				{ email: userSnap.data().email, userID: userSnap.id },
				ACTIVATE_SECRET_KEY,
				{ expiresIn: ACTIVATE_RELOAD_INTERVAL }
			)
			await ActivateTokenController.add(activeToken, userSnap.id)
			EmailService.send(
				email,
				"Account activation",
				`http://localhost:${process.env.PORT}/auth/activate/${activeToken}`
			)

			res.sendStatus(201)
		} catch (e) {
			next(e)
		}
	}

	static activate = async (req, res, next) => {
		try {
			const { activate_token } = req.params
			if (!activate_token) throw ErrorHandler.BadRequest("token is undefined")
			const userID = await ActivateTokenController.get(activate_token)
			if (!userID) throw ErrorHandler.NotFound("Account is undefined")
			await UserController.update(userID, { activated: true })
			await ActivateTokenController.delete(activate_token)

			res.status(201).send("Account activated")
		} catch (e) {
			next(e)
		}
	}

	static async logout(req, res, next) {
		try {
			const session = req.session
			if (!session.userID) throw ErrorHandler.BadRequest("invalid input data")

			await SessionController.unbindUser(session.userID, session.id)
			session.destroy(() => { })
			const socketIDs = await SocketController.getFromSessionID(session.id)
			socketIDs.map(async (socketID) => {
				await SocketController.unbindSession(session.id, socketID)
				await SocketController.delete(socketID)
			})
			res.clearCookie()
			res.send("You`re logged out")
		} catch (e) {
			next(e)
		}
	}

	static async sendRestoreToken(req, res, next) {
		try {
			const { email } = req.body
			if (!email) throw ErrorHandler.BadRequest("Email is undefined")

			const userSnap = await UserController.getFromEmail(email)
			if (!userSnap.exists())
				throw ErrorHandler.BadRequest("User with this email isn`t exist")

			const restoreToken = jwt.sign(
				{ email: email, userID: userSnap.id },
				RESTORE_SECRET_KEY,
				{ expiresIn: RESTORE_RELOAD_INTERVAL }
			)

			await RestoreTokenController.add(restoreToken, userSnap.id)
			await EmailService.send(
				email,
				"Restore access",
				`Follow the link - http://localhost:3000/auth/restore/${restoreToken}`
			)

			res.status(201).send("code had sent to email")
		} catch (e) {
			next(e)
		}
	}

	static async restoreAccess(req, res, next) {
		try {
			const { newPassword } = req.body
			const { restore_token } = req.params
			if (!restore_token || !newPassword)
				throw ErrorHandler.BadRequest("invalid input data")

			//verify restore token
			if (!jwt.verify(restore_token, RESTORE_SECRET_KEY))
				throw ErrorHandler.BadRequest("Restore token is invalid")
			const userID = await RestoreTokenController.get(restore_token)
			const userSnap = await UserController.getFromID(userID)
			//check token in DB
			if (!userSnap?.exists())
				throw ErrorHandler.BadRequest("User is undefined")

			if (!newPassword.match(/(?=.*[0-9])(?=.*[a-z])[0-9a-zA-Z!@#$%^&*]{6,}/))
				throw ErrorHandler.BadRequest("Password does not match requirements")

			const passSnap = await PassController.getFromUserID(userID)

			const hashPass = bcrypt.hashSync(newPassword, 3)
			if (passSnap.data().value === hashPass)
				throw ErrorHandler.BadRequest("New password is equals to old password")

			await PassController.set(passSnap.ref, hashPass, userID)

			//delete restore token
			await RestoreTokenController.delete(restore_token)

			//logout => delete all sessions
			const sessionIDs = await SessionController.getFromUserID(userID)
			sessionIDs.map(async (sessionID) => {
				const socketIDs = await SocketController.getFromSessionID(sessionID)
				await SessionController.delete(sessionID)
				socketIDs.map(async (socketID) => {
					await SocketController.delete(socketID)
				})
			})

			res.status(201).send("Password had changed! Try log in")
		} catch (e) {
			next(e)
		}
	}
}