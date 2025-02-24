"use strict";

import {Request, Response, NextFunction } from "express";
require('dotenv').config();
import {
    MESSEGE_ERROR,
    STATUS_UNAUTHORIZED,
    STATUS_FORBIDDEN
} from "../constants/data"
import {TokenManager} from "../utils/TokenManager";
import {LoggerService} from "../services/LoggerService";

const tokenManager = new TokenManager()
const logger = new LoggerService().createLogger()
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
            const currentToken = tokenManager
                .setToken(token)
            const expired = currentToken.isExpired()
            if (expired) {
                return res.status(STATUS_FORBIDDEN).json({
                    status: MESSEGE_ERROR,
                    data: [],
                    message: "Invalid or expired token."
                });
            }
            const isAdmin = currentToken.includesAdmin()
            if (!isAdmin) {
                return res.status(STATUS_FORBIDDEN).json({
                    status: MESSEGE_ERROR,
                    data: [],
                    message: "Invalid or expired token, admins access required."
                });
            }
        } catch(error) {
            logger.error(error)
        }
    }
    next();
}