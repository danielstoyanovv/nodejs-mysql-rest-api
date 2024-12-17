import { DataSource } from "typeorm"
const {config} = require("dotenv")
import { User } from "../models/userModel" 
config()

const DB_NAME = process.env.NODE_ENV === 'test' ? process.env.MYSQL_DB_NAME +  "_test" : process.env.MYSQL_DB_NAME

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: DB_NAME,
    entities: [User],
    logging: true,
    synchronize: true,
})