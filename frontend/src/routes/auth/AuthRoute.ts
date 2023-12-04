import {HttpClient} from "@/routes/HttpClient";
import {EAuthRoutes} from "@/routes/auth/EAuthRoutes";
import {IAuthService} from "@/routes/auth/IAuthService";
import {MathHandler} from "@/handlers/MathHandler";
import {HmacSigner} from "@/classes/crypto/ciphers/HmacSigner";
import {RsaCipher} from "@/classes/crypto/ciphers/RsaCipher";

export class AuthRoute {

    static async login(email: string, pass: string){
        const clientPrivateKey = MathHandler.getRandomInt(100, 1000)
        let P = 0
        let G = 0
        while (!MathHandler.isNumSimple(P) && !MathHandler.isNumSimple((P - 1) / 2) && !MathHandler.isNumSimple(G)) {
            P = MathHandler.getRandomInt(100, 1000)
            G = MathHandler.getPrimitiveRoot(clientPrivateKey, 10, P)
        }

        const clientPublicKey = ((BigInt(G) ** BigInt(clientPrivateKey)) % BigInt(P)).toString()

        const hmac = new HmacSigner()
        await hmac.generateKey()
        const HMACKeyJwk = await hmac.exportKey()

        const rsa = new RsaCipher()
        await rsa.generateKey()
        const decryptKeyJwk = await rsa.exportKey()

        const signature = await hmac.sign(Buffer.from(clientPublicKey))

        const clientPublicKeySignatureEncrypted = await rsa.encrypt(new Uint8Array(signature))

        const res = await HttpClient.post(EAuthRoutes.login, {email, pass, G, P, decryptKeyJwk, HMACKeyJwk, pubNum: clientPublicKey, publicNumSignatureEncrypted: new Uint8Array(clientPublicKeySignatureEncrypted).toString()});
        const { serverPubNum } = res.data;

        const key = BigInt(serverPubNum) ** BigInt(clientPrivateKey) % BigInt(P)
        localStorage.setItem('key', key.toString())

        return res;
    }

    static async registration(username: string, email: string, pass: string){
        return HttpClient.post(EAuthRoutes.registration, {name: username, email, pass});
        //todo: change name to username in backend
    }

    static async logout(){
        return HttpClient.get(EAuthRoutes.logout);
    }
}