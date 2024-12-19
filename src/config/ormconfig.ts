"use strict";

import { DataSource } from "typeorm";
const {config} = require("dotenv")
config()

const DB_NAME = process.env.NODE_ENV === 'test' ? process.env.DB_NAME +  "_test" : process.env.DB_NAME
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: DB_NAME || "mydatabase",
    synchronize: true,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    subscribers: ["src/subscriber/**/*.ts"],
});
