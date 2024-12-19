"use strict";

import {Request, Response, NextFunction } from "express";
import { User } from "../entity/User";
import { AppDataSource } from "../config/ormconfig"
import { STATUS_ERROR } from "../constants/data"

export async function existsUserMiddleware(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;
    const existsUser = await AppDataSource.getRepository(User).findOneBy({"email": email})
    if (existsUser && existsUser.email) {
        return res.status(400).json({
            status: STATUS_ERROR, 
            data: [],
            message: "User already exists"
        })
    }
    next();
}