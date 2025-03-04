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
     * Get user email
     * @return {string}
     */
    getEmail() {
        return this.#email
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
     * Get user password
     * @return {string}
     */
    getPassword() {
        return this.#password
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
     * Get user role
     * @return {string}
     */
    getRole() {
        return this.#role
    }

    /**
     * Check if user email is valid
     * @return {boolean}
     */
    isEmailValid() {
        const validEmail = emailValidator.validate(this.getEmail())
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
        if (this.getPassword().length > 20 || this.getPassword().length < 6) {
            return false
        }
        return true
    }

    /**
     * Check if user role is valid
     * @return {boolean}
     */
    isRoleValid() {
        const validRole = ROLES.includes(this.getRole())
        if (validRole) {
            return true
        }
        return  false
    }
}