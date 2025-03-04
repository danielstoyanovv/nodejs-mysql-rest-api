"use strict";

import { User } from "../entity/User";
import {AppDataSource} from "../config/ormconfig";
export class UserManager {
    #email: string

    /**
     * Set user email
     * @param {string} email
     * @return {this}
     */
    setEmail(email: string) {
        this.#email = email
        return this
    }

    /**
     * Get user email
     * @return {string}
     */
    getEmail() {
        return this.#email
    }

    /**
     * Check Is user email exists
     * @return {boolean}
     */
    async emailExists() {
        const existsUser = await AppDataSource.getRepository(User).findOneBy({"email": this.getEmail()})
        if (existsUser && existsUser.email) {
            return true
        }
        return false
    }
}