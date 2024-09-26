import { DataSource } from "typeorm"
const {config} = require("dotenv")
import { User } from "../models/userModel" 
config()

const DB_NAME = process.env.NODE_ENV === 'test' ? process.env.AWS_MYSQL_DB_NAME +  "_test" : process.env.AWS_MYSQL_DB_NAME

export const myDataSource = new DataSource({
    type: "mysql",
    host: process.env.AWS_MYSQL_HOST,
    port: Number(process.env.AWS_MYSQL_PORT),
    username: process.env.AWS_MYSQL_USERNAME,
    password: process.env.AWS_MYSQL_PASSWORD,
    database: DB_NAME,
    entities: [User],
    logging: true,
    synchronize: true,
})