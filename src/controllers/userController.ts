"use strict";

import { User } from '../entity/User'
import { Request, Response } from "express"
const bcrypt = require("bcrypt")
import {
    STATUS_SUCCESS,
    STATUS_ERROR,
    INTERNAL_SERVER_ERROR } from "../constants/data"
import { AppDataSource } from "../config/ormconfig"
import {RedisServerService} from "../services/RedisServerService";

const redisClient = new RedisServerService().getRedisClient
export const getUsers = async ( req: Request,  res: Response) => {
    try {
        const limit = Number(req.query.limit || null)
        const [users, total] = await AppDataSource.getRepository(User).findAndCount({
            order: {
                id: "DESC",
            },
            take: limit
        })
        if (req.query.limit) {
            await redisClient.del("users")
        } else {
            await redisClient.setEx("users", 600, JSON.stringify(users)); // Cache data for 10 minutes
        }
        res.status(200).json({
            status: STATUS_SUCCESS, 
            data: {
                users,
                "total" : total
            },
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR 
        });
    }
}

export const createUser = async ( req: Request,  res: Response) => {
    try {
        const { email, role } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await AppDataSource.getRepository(User).create({email, role, password})
        const results = await AppDataSource.getRepository(User).save(user)
        await redisClient.del("users")
        res.status(201).json({ 
            status: STATUS_SUCCESS, 
            data: results,
            message: "New user registered successfully" 
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR 
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const results = await AppDataSource.getRepository(User).delete(id)
        await redisClient.del("users")
        const cacheKey = "user_" + id
        await redisClient.del(cacheKey)

        res.status(200).json({
            status: STATUS_SUCCESS,
            data: [],
            message: "User is deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR
        })

    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const user = await AppDataSource.getRepository(User).findOneBy({
            id: id,
        })
        if (user) {
            const { email, role } = req.body;
            const password = await bcrypt.hash(req.body.password, 10);

            AppDataSource.getRepository(User).merge(user, {email, role, password})
            const results = await AppDataSource.getRepository(User).save(user)
            await redisClient.del("users")
            const cacheKey = "user_" + id
            await redisClient.del(cacheKey)
            res.status(200).json({
                status: STATUS_SUCCESS, 
                data: results,
                message: ""
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR
        })

    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        const results = await AppDataSource.getRepository(User).findOneBy({id: id})
        if (results) {
            const cacheKey = "user_" + id
            await redisClient.setEx(cacheKey, 600, JSON.stringify(results)); // Cache data for 10 minutes
            res.status(200).json({
                status: STATUS_SUCCESS, 
                data: results,
                message: ""
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR
        })

    }
}