import {Request, Response, NextFunction } from "express";
import { User } from "../models/userModel";
import { myDataSource } from "../config/app-data-source"
import { STATUS_ERROR } from "../constants/data"

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const { email } = req.body;
    const user = await myDataSource.getRepository(User).findOneBy({"id": Number(id)})
    if (user && user.email !== email) {
        const existsUser = await myDataSource.getRepository(User).findOneBy({"email": email})
        if (existsUser && existsUser.email) {
            return res.status(400).json({
                status: STATUS_ERROR, 
                data: [],
                message: "User already exists"
            })
        }
    }
    next();
}