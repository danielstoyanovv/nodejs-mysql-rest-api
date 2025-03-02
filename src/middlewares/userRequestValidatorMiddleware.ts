"use strict";

import {Request, Response, NextFunction } from "express";
import {UserRequestValidator} from "../utils/UserRequestValidator";
import {
    MESSEGE_ERROR,
    STATUS_BAD_REQUEST
} from "../constants/data"

export const userRequestValidatorMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;
    const validator = new UserRequestValidator()
        .setEmail(email)
        .setPassword(password)
        .setRole(role)

    const validationErrors = [];
    if (!validator.isEmailValid()) {
        validationErrors.push('email is not valid ')
    }
    if (!password || !validator.isPasswordValid()) {
        validationErrors.push("password is not valid ");
    }
    if (!role || !validator.isRoleValid()) {
        validationErrors.push("role is not valid, valid roles: 'admin', 'user' ")
    }
    if (validationErrors.length > 0) {
        return res.status(STATUS_BAD_REQUEST).json({
            status: MESSEGE_ERROR,
            data: [],
            message: validationErrors
        })
    }
    next();
}