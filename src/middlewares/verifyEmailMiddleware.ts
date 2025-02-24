"use strict";

import {Request, Response, NextFunction } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../config/ormconfig"
import {
    MESSEGE_ERROR,
    STATUS_BAD_REQUEST
} from "../constants/data"

export const verifyEmailMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { email } = req.body;
    const user = await AppDataSource.getRepository(User).findOneBy({"id": Number(id)})
    if (user && user.email !== email) {
        const existsUser = await AppDataSource.getRepository(User).findOneBy({"email": email})
        if (existsUser && existsUser.email) {
            return res.status(STATUS_BAD_REQUEST).json({
                status: MESSEGE_ERROR,
                data: [],
                message: "User already exists"
            })
        }
    }
    next();
}