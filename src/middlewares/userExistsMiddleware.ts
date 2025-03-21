"use strict";

import {Request, Response, NextFunction } from "express";
import {
    MESSEGE_ERROR,
    STATUS_BAD_REQUEST
} from "../constants/data"

import {UserManager} from "../utils/UserManager";

export async function userExistsMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
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
    next();
}