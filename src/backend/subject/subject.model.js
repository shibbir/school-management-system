const path = require("path");
const { DataTypes } = require("sequelize");

const User = require("../user/user.model");
const Program = require("../class/class.model");
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
    content: {
        type: DataTypes.STRING
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
    schema: "sms",
    tableName: "subjects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

Program.hasMany(Subject, { as: "subjects", foreignKey: { name: "class_id", allowNull: false }});
User.hasMany(Subject, { as: "subjects", foreignKey: { name: "teacher_id", allowNull: false }});
Subject.belongsTo(User, { as: "modifier", foreignKey: "updated_by" });
Subject.belongsTo(User, { as: "teacher", foreignKey: "teacher_id" });
Subject.belongsTo(Program, { as: "class", foreignKey: "class_id" });

module.exports = Subject;
