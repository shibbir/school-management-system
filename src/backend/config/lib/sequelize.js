const Sequelize = require("sequelize");

exports.dbConnector = new Sequelize(`${process.env.POSTGRES_URL}/${process.env.POSTGRES_DATABASE}`);
