"use strict";

import {Request, Response, NextFunction } from "express";
import {
    MESSEGE_ERROR,
    STATUS_BAD_REQUEST
} from "../constants/data"
import {UserManager} from "../utils/UserManager";

const manager = new UserManager()

export const verifyEmailMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { email } = req.body;
    const user = await manager
        .setId(Number(id))
        .getUserById()
    if (user && user.email !== email) {
        const manager = new UserManager()
            .setEmail(email)
        const existsUser = await manager.emailExists()
        if (existsUser) {
            return res.status(STATUS_BAD_REQUEST).json({
                status: MESSEGE_ERROR,
                data: [],
                message: "User already exists"
            })
        }
    }
    next();
}