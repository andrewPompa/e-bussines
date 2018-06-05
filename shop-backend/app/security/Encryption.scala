package security

import java.security.MessageDigest
import java.util

import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec
import org.apache.commons.codec.binary.Base64

object Encryption {
    def encrypt(key: String, value: String): String = {
        val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        cipher.init(Cipher.ENCRYPT_MODE, keyToSpec(key))
        Base64.encodeBase64String(cipher.doFinal(value.getBytes("UTF-8")))
    }

    def decrypt(key: String, encryptedValue: String): String = {
        val cipher: Cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING")
        cipher.init(Cipher.DECRYPT_MODE, keyToSpec(key))
        new String(cipher.doFinal(Base64.decodeBase64(encryptedValue)))
    }

    def keyToSpec(key: String): SecretKeySpec = {
        var keyBytes: Array[Byte] = (SALT + key).getBytes("UTF-8")
        val sha: MessageDigest = MessageDigest.getInstance("SHA-256")
        keyBytes = sha.digest(keyBytes)
        keyBytes = util.Arrays.copyOf(keyBytes, 16)
        new SecretKeySpec(keyBytes, "AES")
    }

    private val SALT: String =
        "l*fsadjf1!5g1581fdsaadfaspoLxSADHGASDJGA1$5^128512508+8T1285695128T798GDOJSIAVBAOG0T72TGOUI4V9B8YASFDOIJB"
}