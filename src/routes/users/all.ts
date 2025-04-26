"use strict";

import express, {Request, Response} from "express";
import {
    MESSEGE_SUCCESS,
    STATUS_OK
} from "../../constants/data";
import {UserService} from "../../services/UserService";
import {RedisService} from "../../services/RedisService";
import {getCachedUsersMiddleware} from "../../middlewares/getCachedUsersMiddleware";

const service = new UserService()
const redisClient = new RedisService().createClient()

const router = express.Router()

router.get("/api/v1/users", [
    getCachedUsersMiddleware
], async (req: Request, res: Response) => {
    const limit = Number(req.query.limit || null)
    const usersData = await service
        .setLimit(limit)
        .getUsers()
    const users = usersData.users
    const total = usersData.total
    req.query.limit != undefined ?
        await redisClient.del("users") : await redisClient.setEx("users", 600, JSON.stringify(users));

    res.status(STATUS_OK).json({
        status: MESSEGE_SUCCESS,
        data: {
            users,
            "total": total
        },
        message: ""
    })
})

export { router as allUsersRouter }