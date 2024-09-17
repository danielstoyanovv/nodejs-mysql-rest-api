"use strict";

import { User } from '../models/userModel'
import { Request, Response } from "express"
const bcrypt = require("bcrypt")
import { STATUS_SUCCESS, STATUS_ERROR, INTERNAL_SERVER_ERROR } from "../config/data"
import { myDataSource } from "../config/app-data-source"

export const getUsers = async ( req: Request,  res: Response) => {
    try { 
        const limit = req.query.limit ?? null
        const [users, total] = await myDataSource.getRepository(User).findAndCount({
            order: {
                id: "DESC",
            }  
        })
        res.status(200).json({
            status: STATUS_SUCCESS, 
            data: {
                users,
                "total" : total
            },
            message: ""
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR 
        });
    }
}

export const createUser = async ( req: Request,  res: Response) => {
    try {
        const { email, role } = req.body;
        const password = await bcrypt.hash(req.body.password, 10);
        const user = await myDataSource.getRepository(User).create({email, role, password})
        const results = await myDataSource.getRepository(User).save(user)
        res.status(201).json({ 
            status: STATUS_SUCCESS, 
            data: results,
            message: "New user registered successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR 
        });
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const results = await myDataSource.getRepository(User).delete(req.params.id)
        res.status(200).json({
            status: STATUS_SUCCESS,
            data: [],
            message: "User is deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR
        })

    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await myDataSource.getRepository(User).findOneBy({
            id: Number(req.params.id),
        })
        if (user) {
            const { email, role } = req.body;
            const password = await bcrypt.hash(req.body.password, 10);
            myDataSource.getRepository(User).merge(user, {email, role, password})
            const results = await myDataSource.getRepository(User).save(user)
            res.status(200).json({
                status: STATUS_SUCCESS, 
                data: results,
                message: ""
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR
        })

    }
}

export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        console.log(typeof id)
        const results = await myDataSource.getRepository(User).findOneBy({id: Number(id)})
        if (results) {
            res.status(200).json({
                status: STATUS_SUCCESS, 
                data: results,
                message: ""
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: STATUS_ERROR, 
            data: [],
            message: INTERNAL_SERVER_ERROR
        })

    }
}