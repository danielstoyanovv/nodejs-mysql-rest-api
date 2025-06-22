"use strict";

const winston = require("winston");
import {LoggerServiceInterface} from "./LoggerServiceInterface";

export class LoggerService implements LoggerServiceInterface {
    /**
     * create logger
     * @return {object}
     */
    createLogger() {
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: {service: "user-service"},
            transports: [
                //
                // - Write all logs with importance level of `error` or higher to `error.log`
                //   (i.e., error, fatal, but not other levels)
                //
                new winston.transports.File({filename: 'error.log', level: 'error'}),
                //
                // - Write all logs with importance level of `info` or higher to `combined.log`
                //   (i.e., fatal, error, warn, and info, but not trace)
                //
                new winston.transports.File({filename: 'application.log'}),
            ],
        });
        return logger
    }
}