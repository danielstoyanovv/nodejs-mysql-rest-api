"use strict";

import { User } from '../entity/User'
import { Request, Response } from "express"
import {config} from "dotenv"
import {
    MESSEGE_SUCCESS,
    MESSEGE_ERROR,
    MESSEGE_INTERNAL_SERVER_ERROR,
    STATUS_INTERNAL_SERVER_ERROR,
    STATUS_UNAUTHORIZED
} from "../constants/data"
config()
import { AppDataSource } from "../config/ormconfig"
import { TokenService } from "../services/TokenService";
import {LoggerService} from "../services/LoggerService";

const logger = new LoggerService().createLogger()

export const loginUser = async ( req: Request,  res: Response) => {
    const { email, password, role } = req.body;
    const INVALID_EMAIL_PASSWORD = "Invalid email or password";
    try {
        const user = await AppDataSource.getRepository(User).findOneBy({"email": email})
        if (!user) {
            return res.status(STATUS_UNAUTHORIZED).json({
                status: MESSEGE_ERROR,
                data: [] ,
                message: INVALID_EMAIL_PASSWORD 
            });
        }
        const bcrypt = require("bcrypt")
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(STATUS_UNAUTHORIZED).json({
                status: MESSEGE_ERROR,
                data: [],
                message: INVALID_EMAIL_PASSWORD
            });
        }
        if (user.role !== role) {
            return res.status(STATUS_UNAUTHORIZED).json({
                status: MESSEGE_ERROR,
                data: [],
                message: "Invalid role" 
            });
        }
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

    } catch (error) {
        logger.error(error)
        res.status(STATUS_INTERNAL_SERVER_ERROR).json({
            status: MESSEGE_ERROR,
            data: [],
            message: MESSEGE_INTERNAL_SERVER_ERROR
        });
    }
}