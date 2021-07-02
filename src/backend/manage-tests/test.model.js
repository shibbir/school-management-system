const path = require("path");
const { DataTypes } = require("sequelize");

const User = require("../manage-users/user.model");
const Subject = require("../manage-subjects/subject.model");
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
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        allowNull: false,
        type: DataTypes.ENUM,
        defaultValue: "active",
        values: ["active", "archived"]
    },
    created_by: {
        allowNull: false,
        type: DataTypes.UUID
    },
    updated_by: {
        allowNull: false,
        type: DataTypes.UUID
    },
}, {
    schema: process.env.POSTGRES_DATABASE_SCHEMA,
    tableName: "tests",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

Subject.hasMany(Test, { as: "tests", foreignKey: { name: "subject_id", allowNull: false }});
Test.belongsTo(Subject, { as: "subject", foreignKey: "subject_id" });

Test.belongsTo(User, { as: "modifier", foreignKey: "updated_by" });

module.exports = Test;
