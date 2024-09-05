import { DataSource } from "typeorm"
const {config} = require("dotenv")
import { User } from "../models/userModel" 
config()

const DB_NAME = process.env.NODE_ENV === 'test' ? "application_test" : "application"

export const myDataSource = new DataSource({
    type: "mysql",
    host: "database-1.c7im2qcwahmm.eu-west-3.rds.amazonaws.com",
    port: 3306,
    username: "root",
    password: "dAevfhzf",
    database: DB_NAME,
    entities: [User],
    logging: true,
    synchronize: true,
})