"use strict";

import { User } from "../entity/User";
import {AppDataSource} from "../config/ormconfig";
export class UserManager {
    #email: string
    #role: string
    #password: string
    #limit: number
    #id: number
    #userObject: User

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
     * Set user id
     * @param {number} id
     * @return {this}
     */
    setId(id: number) {
        this.#id = id
        return this
    }

    /**
     * Get user id
     * @return {number}
     */
    getId() {
        return this.#id
    }

    /**
     * Check Is authentication token expired
     * @return {boolean}
     */
    async emailExists() {
        const existsUser = await AppDataSource.getRepository(User).findOneBy({"email": this.getEmail()})
        if (existsUser && existsUser.email) {
            return true
        }
        return false
    }

    /**
     * Set limit
     * @param {number} limit
     * @return {this}
     */
    setLimit(limit: number) {
        this.#limit = limit
        return this
    }

    /**
     * Get limit
     * @return {number}
     */
    getLimit() {
        return this.#limit
    }

    /**
     * Set user
     * @param {object} userObject
     * @return {this}
     */
    setUserObject(userObject: User) {
        this.#userObject = userObject
        return this
    }

    /**
     * Get limit
     * @return {User}
     */
    getUserObject() {
        return this.#userObject
    }

    /**
     * Create user
     * @return {object}
     */
    async createUser() {
        const email = this.getEmail()
        const password = this.getPassword()
        const role = this.getRole()
        const user = await AppDataSource.getRepository(User).create({email, role, password})
        await AppDataSource.getRepository(User).save(user)
        return user
    }

    /**
     * Get users
     * @return {object}
     */
    async getUsers() {
        const limit = this.getLimit()
        const [users, total] = await AppDataSource.getRepository(User).findAndCount({
            order: {
                id: "DESC",
            },
            take: limit
        })
        return {
            users: users,
            total: total
        }
    }

    /**
     * Get user
     * @return {object}
     */
    async getUser() {
        const id = this.getId()
        return await AppDataSource.getRepository(User).findOneBy({id: id})
    }

    /**
     * Delete user
     * @return {void}
     */
    async deleteUser() {
        await AppDataSource.getRepository(User).delete(this.getId())
    }


    /**
     * Update user
     * @return {object}
     */
    async updateUser() {
        const email = this.getEmail()
        const role = this.getRole()
        const password = this.getPassword()
        const user = this.getUserObject()
        AppDataSource.getRepository(User).merge(user, {email, role, password})
        return await AppDataSource.getRepository(User).save(user)
    }

    /**
     * Get user by email
     * @return {object}
     */
    async getUserByEmail() {
        const email = this.getEmail()
        return await AppDataSource.getRepository(User).findOneBy({"email": email})
    }

    /**
     * Get user by id
     * @return {object}
     */
    async getUserById() {
        const id = this.getId()
        return await AppDataSource.getRepository(User).findOneBy({
            id: id
        })
    }
}