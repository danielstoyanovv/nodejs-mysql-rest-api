"use strict";

import {Request, Response, NextFunction } from "express";
import {TokenManager} from "../utils/TokenManager";
import {UnauthorizedRequestError} from "../errors/unauthorized-request-error";
import {ForbiddenRequestError} from "../errors/forbidden-request-error";

const tokenManager = new TokenManager()
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'] || false
    if (!token) throw new UnauthorizedRequestError("Token is missing in this request!")

    if (token) {
        const currentToken = tokenManager
            .setToken(token)
        const expired = currentToken.isExpired()
        if (expired) throw new ForbiddenRequestError("Invalid or expired token.")
        const isAdmin = currentToken.includesAdmin()
        if (!isAdmin) throw new ForbiddenRequestError("Invalid or expired token, admins access required.")
    }
    next();
}