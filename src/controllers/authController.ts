"use strict";

import { User } from '../models/userModel'
import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import {config} from "dotenv"
import { STATUS_SUCCESS, STATUS_ERROR, INTERNAL_SERVER_ERROR } from "../config/data"
config()
import { myDataSource } from "../config/app-data-source"

export const loginUser = async ( req: Request,  res: Response) => {
    const { email, password, role } = req.body;
    const INVALID_EMAIL_PASSWORD = "Invalid email or password";
    try {
        const user = await myDataSource.getRepository(User).findOneBy({"email": email})
        console.log(user);
        if (!user) {
            return res.status(401).json({ 
                status: STATUS_ERROR, 
                data: [] ,
                message: INVALID_EMAIL_PASSWORD 
            });
        }
        const bcrypt = require("bcrypt")
        console.log(password)
        console.log(user.password)
        
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
        const token = jwt.sign({
            id: user.id,
            email: email,
            role: role
        }, process.env.JWT_SECRET!, {
            expiresIn: 180
        });
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