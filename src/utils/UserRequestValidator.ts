"use strict";

import emailValidator from "email-validator";
const ROLES = ['admin', 'user']
export class UserRequestValidator {
    #email: string
    #password: string
    #role: string

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
     * Set user password
     * @param {string} password
     * @return {this}
     */
    setPassword(password: string) {
        this.#password = password
        return this
    }

    /**
     * Set user role
     * @param {string} role
     * @return {this}
     */
    setRole(role: string) {
        this.#role = role
        return this
    }

    /**
     * Check if user email is valid
     * @return {boolean}
     */
    isEmailValid() {
        const validEmail = emailValidator.validate(this.#email)
        if (validEmail) {
            return true
        }
        return  false
    }

    /**
     * Check if user password is valid
     * @return {boolean}
     */
    isPasswordValid() {
        if (this.#password.length > 20 || this.#password.length < 6) {
            return false
        }
        return true
    }

    /**
     * Check if user role is valid
     * @return {boolean}
     */
    isRoleValid() {
        const validRole = ROLES.includes(this.#role)
        if (validRole) {
            return true
        }
        return  false
    }

}