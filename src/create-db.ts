"use strict";

import {MysqlProcessor} from "./services/mysqlProcessor";

const mysqlProcessor = new MysqlProcessor()

// Create the new mysql database
mysqlProcessor.createDatabase().then(r => {
    console.log(r)
})