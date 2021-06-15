const path = require("path");
const { DataTypes } = require("sequelize");

const Test = require("../manage-tests/test.model");
const User = require("../user/user.model");
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
    created_by: {
        allowNull: false,
        type: DataTypes.UUID
    },
    updated_by: {
        allowNull: false,
        type: DataTypes.UUID
    },
}, {
    schema: "sms",
    tableName: "test_results",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

Test.hasMany(TestResult, { as: "test_results", foreignKey: { name: "test_id", allowNull: false }});
TestResult.belongsTo(User, { as: "pupil", foreignKey: "pupil_id" });
TestResult.belongsTo(User, { as: "modifier", foreignKey: "updated_by" });

module.exports = TestResult;
