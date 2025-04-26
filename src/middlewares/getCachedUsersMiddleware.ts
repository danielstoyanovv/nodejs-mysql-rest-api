"use strict";

import {Request, Response, NextFunction } from "express";
import {
    MESSEGE_SUCCESS,
    STATUS_OK
} from "../constants/data"
import {RedisService} from "../services/RedisService";
export const getCachedUsersMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const redisClient = new RedisService().createClient()
    if (req.query.limit) {
        await redisClient.del("users")
    }
    const cachedData = await redisClient.get("users");
    if (cachedData) {
        const users = JSON.parse(cachedData)
        console.log('Cache hit');
        return res.status(STATUS_OK).json({
            status: MESSEGE_SUCCESS,
            data: {
                users,
                "total" : users.length
            },
            message: ""
        })
    }
    console.log('Cache miss');
    next();
}