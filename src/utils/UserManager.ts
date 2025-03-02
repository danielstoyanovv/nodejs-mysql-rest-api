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
     * Check Is user email exists
     * @return {boolean}
     */
    async emailExists() {
        const existsUser = await AppDataSource.getRepository(User).findOneBy({"email": this.#email})
        if (existsUser && existsUser.email) {
            return true
        }
        return false
    }
}