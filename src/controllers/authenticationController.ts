"use strict";

import { User } from '../entity/User'
import { Request, Response } from "express"
import {config} from "dotenv"
import {
    STATUS_SUCCESS,
    STATUS_ERROR,
    INTERNAL_SERVER_ERROR } from "../constants/data"
config()
import { AppDataSource } from "../config/ormconfig"
import { TokenService } from "../services/TokenService";
export const loginUser = async ( req: Request,  res: Response) => {
    const { email, password, role } = req.body;
    const INVALID_EMAIL_PASSWORD = "Invalid email or password";
    try {
        const user = await AppDataSource.getRepository(User).findOneBy({"email": email})
        if (!user) {
            return res.status(401).json({ 
                status: STATUS_ERROR, 
                data: [] ,
                message: INVALID_EMAIL_PASSWORD 
            });
        }
        const bcrypt = require("bcrypt")
        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(401).json({ 
                status: STATUS_ERROR, 
                data: [],
                message: INVALID_EMAIL_PASSWORD
            });
        }
        if (user.role !== role) {
            return res.status(401).json({ 
                status: STATUS_ERROR, 
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
            token: token
        }
        res.json({
            status: STATUS_SUCCESS, 
            data,
            message: ""
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR
        });
    }
}