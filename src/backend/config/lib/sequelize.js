const Sequelize = require("sequelize");

exports.dbConnector = new Sequelize(`${process.env.POSTGRES_CONNECTION_STRING}/${process.env.POSTGRES_DATABASE}`);
