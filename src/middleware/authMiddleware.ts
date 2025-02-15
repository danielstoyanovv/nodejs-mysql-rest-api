"use strict";

import {Request, Response, NextFunction } from "express";
import {config} from "dotenv"
config()
import {
    MESSEGE_ERROR,
    STATUS_UNAUTHORIZED,
    STATUS_FORBIDDEN

} from "../constants/data"
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || false
    if (!token) {
        return res.status(STATUS_UNAUTHORIZED).json({
            status: MESSEGE_ERROR,
            data: [],
            message: "No token provided."
        });
    }
    if (token) {
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
            const decoded = JSON.parse(decodedJson)
            const exp = decoded.exp;
            const expired = (Date.now() >= exp * 1000)
            if (expired) {
                return res.status(STATUS_FORBIDDEN).json({
                    status: MESSEGE_ERROR,
                    data: [],
                    message: "Invalid or expired token."
                });
            }
            const tokenData = jwt.verify(token, process.env.JWT_SECRET!, {})
            const isAdmin = Object.values(tokenData).includes("admin");
            if (!isAdmin) {
                return res.status(STATUS_FORBIDDEN).json({
                    status: MESSEGE_ERROR,
                    data: [],
                    message: "Invalid or expired token, admins access required."
                });
            }
        } catch(error) {
            console.log(error)    
        }
    }
    next();
}
