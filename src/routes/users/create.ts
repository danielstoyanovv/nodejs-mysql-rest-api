"use strict";

import express, {Request, Response} from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError} from "../../errors/request-validation-error";

const bcrypt = require("bcrypt")
import {
    MESSEGE_SUCCESS,
    STATUS_CREATED
} from "../../constants/data";
import {UserService} from "../../services/UserService";
import {BadRequestError} from "../../errors/bad-request-error";
import {RedisService} from "../../services/RedisService";

const redisClient = new RedisService().createClient()

const router = express.Router()

router.post("/api/v1/users", [
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
        .withMessage("Role must be between 4 and 20 characters")

], async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }
    const { email, role } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    const service = new UserService()

    const exists = await service
        .setEmail(email)
        .setRole(role)
        .getUserByEmail()
    if (exists) throw new BadRequestError("Email in use")
    const user = await service
        .setEmail(email)
        .setPassword(password)
        .createUser()
    await redisClient.del("users")
    const resourcesURI =  "/api/v1/users/" + user.id
    res.status(STATUS_CREATED).json({
        status: MESSEGE_SUCCESS,
        data: resourcesURI,
        message: "New user registered successfully"
    })

})

export { router as createUserRouter }