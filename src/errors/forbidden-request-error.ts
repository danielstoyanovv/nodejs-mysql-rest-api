"use strict";

import {CustomError} from "./custom-error";
import {STATUS_FORBIDDEN} from "../constants/data";

export class ForbiddenRequestError extends CustomError {
    statusCode = STATUS_FORBIDDEN

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, ForbiddenRequestError.prototype)
    }

    serializeErrors() {
        return [{ message: this.message }]
    }
}