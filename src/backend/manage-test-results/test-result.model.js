const path = require("path");
const { DataTypes } = require("sequelize");

const Test = require("../manage-tests/test.model");
const User = require("../manage-users/user.model");
const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));

const TestResult = sequelize.dbConnector.define("test_results", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    pupil_id: {
        allowNull: false,
        type: DataTypes.UUID
    },
    grade: {
        allowNull: false,
        type: DataTypes.DECIMAL
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
    tableName: "test_results",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

User.hasMany(TestResult, { as: "test_results", foreignKey: { name: "pupil_id", allowNull: false }});

Test.hasMany(TestResult, { as: "test_results", foreignKey: { name: "test_id", allowNull: false }});
TestResult.belongsTo(Test, { as: "test", foreignKey: "test_id" });

TestResult.belongsTo(User, { as: "pupil", foreignKey: { name: "pupil_id", allowNull: false }});
TestResult.belongsTo(User, { as: "modifier", foreignKey: { name: "updated_by", allowNull: false }});

module.exports = TestResult;
