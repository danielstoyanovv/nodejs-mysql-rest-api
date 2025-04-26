"use strict";

import express, {Request, Response} from "express";
const bcrypt = require("bcrypt")
import {
    MESSEGE_SUCCESS,
    STATUS_PATCH
} from "../../constants/data";
import {UserService} from "../../services/UserService";
import {RedisService} from "../../services/RedisService";
import {authMiddleware} from "../../middlewares/authMiddleware";
import {body, validationResult} from "express-validator";
import {RequestValidationError} from "../../errors/request-validation-error";
import {verifyEmailMiddleware} from "../../middlewares/verifyEmailMiddleware";

const service = new UserService()
const redisClient = new RedisService().createClient()

const router = express.Router()

router.patch("/api/v1/users/:id", [
    body("email")
        .isEmail()
        .withMessage("Email is not valid"),
    body("password")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
    body("role")
        .trim()
        .isLength({ min: 4, max: 20 })
        .withMessage("Role must be between 4 and 20 characters"),
    verifyEmailMiddleware,
    authMiddleware
], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }
    const id = Number(req.params.id)
    const user = await service
        .setId(id)
        .getUserById()
    if (user) {
        const { email, role } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        const results = await service
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
})

export { router as patchUserRouter }