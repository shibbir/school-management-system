const path = require("path");
const { DataTypes } = require("sequelize");

const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));

const Subject = sequelize.dbConnector.define("subjects", {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    teacher_id: {
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
    tableName: "subjects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Subject;
