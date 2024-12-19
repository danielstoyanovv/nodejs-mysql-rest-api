module.exports = {
    type: "mysql",
    host: "127.0.0.1",
    port: 3306,
    username: "root",
    password: "",
    database: "application_test",
    synchronize: true,
    logging: false,
    entities: ["build/entity/**/*.js"],
    migrations: ["build/migration/**/*.js"],
    subscribers: ["build/subscriber/**/*.js"],
};
