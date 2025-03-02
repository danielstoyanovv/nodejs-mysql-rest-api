"use strict";

import express from "express"
import {config} from "dotenv"
config()
import {userRequestValidatorMiddleware} from "./middlewares/userRequestValidatorMiddleware";
import {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getUsers} from "./controllers/userController";
import {authMiddleware} from "./middlewares/authMiddleware";
import cors from "cors";
import { userExistsMiddleware } from "./middlewares/userExistsMiddleware";
import { verifyEmailMiddleware } from "./middlewares/verifyEmailMiddleware";
import {loginUser} from "./controllers/authenticationController";
import {getUsersFromCacheMiddleware} from "./middlewares/getUsersFromCacheMiddleware";
import {getUserFromCacheMiddleware} from "./middlewares/getUserFromCacheMiddleware";
import { AppDataSource } from "./config/ormconfig";
import helmet from "helmet";
import {LoggerService} from "./services/LoggerService";

const logger = new LoggerService().createLogger()

AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established.");
    })
    .catch((error) => logger.error("Database connection error:"+ error));

const app = express()

const port = process.env.SERVER_PORT || 4000
const API_PREFIX = process.env.API_PREFIX || "api"
const API_VERSION = process.env.API_VERSION || "v1"

app.use(cors())

app.use(express.json())

app.use(helmet())

app.post("/" + API_PREFIX + "/" + API_VERSION +  "/users", userRequestValidatorMiddleware, userExistsMiddleware, createUser);

app.patch("/" + API_PREFIX + "/" + API_VERSION +  "/users/:id", userRequestValidatorMiddleware, verifyEmailMiddleware, authMiddleware, updateUser)

app.delete("/" + API_PREFIX + "/" + API_VERSION +  "/users/:id", authMiddleware, deleteUser)

app.post("/" + API_PREFIX + "/" + API_VERSION +  "/login", userRequestValidatorMiddleware, loginUser)

app.get("/" + API_PREFIX + "/" + API_VERSION +  "/users", getUsersFromCacheMiddleware, getUsers);

app.get("/" + API_PREFIX + "/" + API_VERSION +  "/users/:id", getUserFromCacheMiddleware, getUser)

app.listen(port, () => {
    console.log('listening on port', port)
})
