"use strict";

import {
    AlternativeValidationError, FieldValidationError,
    GroupedAlternativeValidationError,
    UnknownFieldsError,
} from "express-validator";

import {CustomError} from "./custom-error";
import {STATUS_BAD_REQUEST} from "../constants/data";

export class RequestValidationError extends CustomError {
    statusCode = STATUS_BAD_REQUEST
    constructor(public errors: (AlternativeValidationError | GroupedAlternativeValidationError | UnknownFieldsError | FieldValidationError  )[]) {
        super("Invalid request parameters");
        // Only because we are extending a build in class
        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors() {
        return this.errors.map((err) => {
            if (err.type === 'field') {
                return { message: err.msg, field: err.path };
            }
            return { message: err.msg };
        });
    }
}