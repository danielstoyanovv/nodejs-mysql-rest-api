"use strict";

import {Request, Response, NextFunction } from "express";
import {UserService} from "../services/UserService";
import {BadRequestError} from "../errors/bad-request-error";
const service = new UserService()

export const verifyEmailMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { email } = req.body;
    const user = await service
        .setId(Number(id))
        .getUserById()
    if (user && user.email !== email) {
        const manager = new UserService()
            .setEmail(email)
        const existsUser = await manager.emailExists()
        if (existsUser) throw new BadRequestError("User exists!")
    }
    next();
}