import jwt from "jsonwebtoken";
require('dotenv').config();

export class TokenManager {
    #token: string

    /**
     * Set authentication token
     * @param {string} token
     * @return {this}
     */
    setToken(token: string) {
        this.#token = token
        return this
    }

    /**
     * Check Is authentication token expired
     * @return {boolean}
     */
    isExpired() {
        const payloadBase64 = this.#token.split('.')[1];
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
        const decoded = JSON.parse(decodedJson)
        const exp = decoded.exp;
        const expired = (Date.now() >= exp * 1000)
        if (expired) {
            return true
        }
        return false
    }

    /**
     * Check if authentication token data includes admin
     * @return {boolean}
     */
    includesAdmin() {
        const tokenData = jwt.verify(this.#token, process.env.JWT_SECRET!, {})
        const isAdmin = Object.values(tokenData).includes("admin");
        if (isAdmin) {
            return true
        }
        return false
    }
}