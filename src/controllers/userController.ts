"use strict";

import { Request, Response } from "express"
const bcrypt = require("bcrypt")
import {
    MESSEGE_SUCCESS,
    MESSEGE_ERROR,
    MESSEGE_INTERNAL_SERVER_ERROR,
    STATUS_OK,
    STATUS_PATCH,
    STATUS_NO_CONTENT,
    STATUS_CREATED,
    STATUS_INTERNAL_SERVER_ERROR
} from "../constants/data"
require('dotenv').config()
import {LoggerService} from "../services/LoggerService"
import {RedisService} from "../services/RedisService";
import {UserManager} from "../utils/UserManager";

const redisClient = new RedisService().createClient()
const logger = new LoggerService().createLogger()
const manager = new UserManager()
const API_PREFIX = process.env.API_PREFIX || "api"
const API_VERSION = process.env.API_VERSION || "v1"

export const getUsers = async ( req: Request,  res: Response) => {
    try {
        const limit = Number(req.query.limit || null)
        const usersData = await manager
            .setLimit(limit)
            .getUsers()
        const users = usersData.users
        const total = usersData.total
        req.query.limit != undefined ? await redisClient.del("users") : await redisClient.setEx("users", 600, JSON.stringify(users));
        res.status(STATUS_OK).json({
            status: MESSEGE_SUCCESS,
            data: {
                users,
                "total": total
            },
            message: ""
        })

    } catch (error) {
        console.log(error)
        logger.error(error)
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({
            status: MESSEGE_ERROR,
            data: [],
            message: MESSEGE_INTERNAL_SERVER_ERROR
        });
    }
}

export const createUser = async ( req: Request,  res: Response) => {
    try {
        const { email, role } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await manager
            .setEmail(email)
            .setRole(role)
            .setPassword(password)
            .createUser()
        await redisClient.del("users")
        const resourcesURI = "/" + API_PREFIX + "/" + API_VERSION + "/users/" + user.id
        res.status(STATUS_CREATED).json({
            status: MESSEGE_SUCCESS,
            data: resourcesURI,
            message: "New user registered successfully" 
        });
    } catch (error) {
        logger.error(error)
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({
            status: MESSEGE_ERROR,
            data: [],
            message: MESSEGE_INTERNAL_SERVER_ERROR
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        await manager
            .setId(Number(id))
            .deleteUser()
        await redisClient.del("users")
        const cacheKey = "user_" + id
        await redisClient.del(cacheKey)
        res.status(STATUS_NO_CONTENT).send(); // No content response
    } catch (error) {
        logger.error(error)
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({
            status: MESSEGE_ERROR,
            data: [],
            message: MESSEGE_INTERNAL_SERVER_ERROR
        })

    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const user = await manager
            .setId(id)
            .getUserById()
        if (user) {
            const { email, role } = req.body;
            const password = await bcrypt.hash(req.body.password, 10);
            const results = await manager
                .setEmail(email)
                .setRole(role)
                .setPassword(password)
                .setUserObject(user)
                .updateUser()
            await redisClient.del("users")
            const cacheKey = "user_" + id
            await redisClient.del(cacheKey)
            res.status(STATUS_PATCH).json({
                status: MESSEGE_SUCCESS,
                data: results,
                message: ""
            })
        }
    } catch (error) {
        logger.error(error)
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({
            status: MESSEGE_ERROR,
            data: [],
            message: MESSEGE_INTERNAL_SERVER_ERROR
        })

    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const results = await manager
            .setId(id)
            .getUser()
        if (results) {
            const cacheKey = "user_" + id
            await redisClient.setEx(cacheKey, 600, JSON.stringify(results)); // Cache data for 10 minutes
            res.status(STATUS_OK).json({
                status: MESSEGE_SUCCESS,
                data: results,
                message: ""
            })
        }
    } catch (error) {
        logger.error(error)
        return res.status(STATUS_INTERNAL_SERVER_ERROR).json({
            status: MESSEGE_ERROR,
            data: [],
            message: MESSEGE_INTERNAL_SERVER_ERROR
        })

    }
}