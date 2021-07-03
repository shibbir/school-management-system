const path = require("path");
const { DataTypes } = require("sequelize");

const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));

const Program = sequelize.dbConnector.define("classes", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(50)
    }
}, {
    schema: process.env.POSTGRES_DATABASE_SCHEMA,
    tableName: "classes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Program;
