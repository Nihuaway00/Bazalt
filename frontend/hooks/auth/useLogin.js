import { useMutation, useQuery } from "react-query"
import AuthRoute from "../../routes/authRoute"
import { useDispatch } from "react-redux"
import { setUser } from "../../store/slices/userSlice"
import { store } from "../../store/store"
import { MathHandler } from "../../handlers/mathHandler"
import { HmacCryptoHandler } from "../../classes/crypto/HmacCipher"
import { RsaCryptoHandler } from "../../classes/crypto/RsaCipher"

export const useLogin = () => {
	return useMutation(['login'], async ({ email, pass }) => {

		const clientPrivateKey = MathHandler.getRandomInt(100, 1000)
		let P = 0
		let G = 0
		while (!MathHandler.isNumSimple(P) && !MathHandler.isNumSimple((P - 1) / 2) && !MathHandler.isNumSimple(G)) {
			P = MathHandler.getRandomInt(100, 1000)
			G = MathHandler.getPrimitiveRoot(clientPrivateKey, 10, P)
		}

		const clientPublicKey = ((BigInt(G) ** BigInt(clientPrivateKey)) % BigInt(P)).toString()

		const hmac = new HmacCryptoHandler()
		await hmac.generateKey()
		const HMACKeyJwk = await hmac.export()

		const rsa = new RsaCryptoHandler()
		await rsa.generateKeys()
		const { decryptKeyJwk } = await rsa.export()

		const signature = await hmac.sign(Buffer.from(clientPublicKey))

		const clientPublicKeySignatureEncrypted = await rsa.encrypt(new Uint8Array(signature))

		const res = await AuthRoute.login(email, pass, clientPublicKey, decryptKeyJwk, HMACKeyJwk, G, P, new Uint8Array(clientPublicKeySignatureEncrypted).toString())
		const { server_pubNum } = res.data

		const key = BigInt(server_pubNum) ** BigInt(clientPrivateKey) % BigInt(P)
		localStorage.setItem("key", key)
	})
}