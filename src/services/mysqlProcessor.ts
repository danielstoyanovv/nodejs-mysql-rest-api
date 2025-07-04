"use strict"

import {DatabaseProcessor} from "./databaseProcessor";
const mysql = require('mysql2');
const {config} = require("dotenv")
config()
import {LoggerService} from "./LoggerService";
import {DatabaseConnectionError} from "../errors/database-connection-error";

const logger = new LoggerService().createLogger()
const DB_NAME = process.env.NODE_ENV === 'test' ? process.env.DB_NAME +  "_test" : process.env.DB_NAME

export class MysqlProcessor extends DatabaseProcessor {
    createDatabase() {
        const db = mysql.createConnection({
            host: process.env.DB_HOST || "127.0.0.1",
            user: "root",

            password: "",
            database: "mysql"
        });
        db.connect((err) => {
            if (err) {
                logger.error('Error connecting to MySQL:', err.message);
                throw new DatabaseConnectionError(err.message);
            }
            logger.info('Connected to MySQL database');
            db.query('CREATE DATABASE ' + DB_NAME)
            logger.info(`Mysql database ${DB_NAME} created! ` + new Date())
        });
    }
}