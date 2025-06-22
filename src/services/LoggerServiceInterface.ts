import winston from "winston";

export interface LoggerServiceInterface {
    /**
     * create logger
     * @return {object}
     */
    createLogger(): winston.Logger;
}