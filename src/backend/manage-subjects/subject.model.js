const { DataTypes } = require("sequelize");

const sequelize = require("../config/lib/sequelize");
const User = require("../manage-users/user.model");
const Program = require("../manage-classes/class.model");

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
    }
}, {
    schema: process.env.POSTGRES_DATABASE_SCHEMA,
    tableName: "subjects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

Program.hasMany(Subject, { as: "subjects", foreignKey: "class_id" });
Subject.belongsTo(Program, { as: "class", foreignKey: "class_id" });

User.hasMany(Subject, { as: "subjects", foreignKey: { name: "teacher_id", allowNull: false }});
Subject.belongsTo(User, { as: "teacher", foreignKey: { name: "teacher_id", allowNull: false }});

Subject.belongsTo(User, { as: "modifier", foreignKey: "updated_by" });

module.exports = Subject;
