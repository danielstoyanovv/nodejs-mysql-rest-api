"use strict";

import {CustomError} from "./custom-error";
import {STATUS_UNAUTHORIZED} from "../constants/data";

export class UnauthorizedRequestError extends CustomError {
    statusCode = STATUS_UNAUTHORIZED

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedRequestError.prototype)
    }

    serializeErrors() {
        return [{ message: this.message }]
    }
}