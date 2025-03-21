"use strict";

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
     * Get authentication token
     * @return {string}
     */
    getToken() {
        return this.#token
    }

    /**
     * Check Is authentication token expired
     * @return {boolean}
     */
    isExpired() {
        const payloadBase64 = this.getToken().split('.')[1];
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
        const decoded = JSON.parse(decodedJson)
        const exp = decoded.exp;
        const expired = (Date.now() >= exp * 1000)
        return expired
    }

    /**
     * Check if authentication token data includes admin
     * @return {boolean}
     */
    includesAdmin() {
        const tokenData = jwt.verify(this.getToken(), process.env.JWT_SECRET!, {})
        return Object.values(tokenData).includes("admin");
    }
}