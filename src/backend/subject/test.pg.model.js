const path = require("path");
const { DataTypes } = require("sequelize");

const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));


const Test = sequelize.dbConnector.define("tests", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    date: {
        allowNull: false,
        type: DataTypes.DATE
    },
    subject_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
    created_by: {
        type: DataTypes.UUID
    },
    updated_by: {
        type: DataTypes.UUID
    },
}, {
    schema: "sms",
    tableName: "tests",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});



module.exports = Test;
