"use strict";

import express from "express"
import "express-async-errors"
import {config} from "dotenv"
config()
import cors from "cors";
import { AppDataSource } from "./config/ormconfig";
import helmet from "helmet";
import {createUserRouter} from "./routes/users/create";
import {allUsersRouter} from "./routes/users/all";
import {deleteUserRouter} from "./routes/users/delete";
import {oneUserRouter} from "./routes/users/one";
import {patchUserRouter} from "./routes/users/update";
import {loginRouter} from "./routes/auth/login";
import {errorHandlerMiddleware} from "./middlewares/error-handlerMiddleware";
import {DatabaseConnectionError} from "./errors/database-connection-error";

AppDataSource.initialize()
    .then(() => {
        console.log("Database connection established.");
    })
    .catch((error) => {throw new DatabaseConnectionError(error)});

const app = express()

const port = process.env.SERVER_PORT || 4000

app.use(cors())

app.use(express.json())

app.use(helmet())

app.use(allUsersRouter)
app.use(createUserRouter)
app.use(deleteUserRouter)
app.use(oneUserRouter)
app.use(patchUserRouter)
app.use(loginRouter)
app.use(errorHandlerMiddleware)

app.listen(port, () => {
    console.log('listening on port', port)
})
