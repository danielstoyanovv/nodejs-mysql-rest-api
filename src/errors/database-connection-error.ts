"use strict";

export class DatabaseConnectionError extends Error {
    constructor(public error: any) {
        super("Database connection error: " + error)
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
}