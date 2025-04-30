"use strict";

import {
    MESSEGE_SUCCESS,
} from "../../constants/data"
import { TokenService } from "../../services/TokenService";
import express, {Request, Response} from "express";
import { body } from "express-validator";
import {UserService} from "../../services/UserService";
import {UnauthorizedRequestError} from "../../errors/unauthorized-request-error";
import {validateRequestMiddleware} from "../../middlewares/validate-requestMiddleware";

const service = new UserService()

const router = express.Router()

router.post("/api/v1/login", [
    body("email")
        .isEmail()
        .withMessage("Email is not valid"),
    body("password")
        .trim()
        .notEmpty()
        .isLength({ min: 4, max: 20 })
        .withMessage("Password must be between 4 and 20 characters"),
    body("role")
        .trim()
        .notEmpty()
        .isLength({ min: 4, max: 20 })
        .withMessage("Role must be between 4 and 20 characters"),
    validateRequestMiddleware

], async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const INVALID_EMAIL_PASSWORD = "Invalid email or password";
    const user = await service
        .setEmail(email)
        .getUserByEmail()
    if (!user) throw new UnauthorizedRequestError(INVALID_EMAIL_PASSWORD)

    const bcrypt = require("bcrypt")
    const result = await bcrypt.compare(password, user.password);
    if (!result) throw new UnauthorizedRequestError(INVALID_EMAIL_PASSWORD)
    if (user.role !== role) throw new UnauthorizedRequestError("Role is not valid!")

    const token = new TokenService()
        .setUserId(user.id)
        .setUserEmail(email)
        .setUserRole(role)
        .getToken
    const data = {
        token: token,
        logged_user_id: user.id
    }
    res.json({
        status: MESSEGE_SUCCESS,
        data,
        message: ""
    });
})

export { router as loginRouter }