"use strict";

export abstract class DatabaseProcessor {
    abstract createDatabase ()
    abstract getConnectionDriver()
}