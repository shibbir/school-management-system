const path = require("path");
const { DataTypes } = require("sequelize");

const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));
const Program = require("../class/class.pg.model");
const Test = require("./test.pg.model");
const User = require("../user/user.pg.model");
const Subject = require("./subject.pg.model");

const TestResult = sequelize.dbConnector.define("test_results", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    test_id: {
        allowNull: false,
        type: DataTypes.UUID
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
        type: DataTypes.UUID
    },
    updated_by: {
        type: DataTypes.UUID
    },
}, {
    schema: "sms",
    tableName: "test_results",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

Program.hasMany(User, { as: "pupils" });
User.belongsTo(Program, { foreignKey: "program_id" });

User.hasMany(Subject, { as: "subjects" });
Subject.belongsTo(User, { foreignKey: "teacher_id" });

Subject.hasMany(Test, { as: "tests" });
Test.belongsTo(Subject, { foreignKey: "subject_id" });

Test.hasMany(TestResult, { foreignKey: "test_id" });
TestResult.belongsTo(Test, { foreignKey: "test_id" });

module.exports = TestResult;
