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
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    status: {
        allowNull: false,
        type: DataTypes.ENUM,
        defaultValue: "active",
        values: ["active", "archived"]
    }
}, {
    schema: process.env.POSTGRES_DATABASE_SCHEMA,
    tableName: "subjects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

const ClassSubject = sequelize.dbConnector.define("class_subjects", {}, {
    schema: process.env.POSTGRES_DATABASE_SCHEMA,
    tableName: "class_subjects",
    timestamps: false
});

Program.belongsToMany(Subject, { as: "subjects", through: ClassSubject, foreignKey: "class_id" });
Subject.belongsToMany(Program, { as: "classes", through: ClassSubject, foreignKey: "subject_id" });

User.hasMany(Subject, { as: "subjects", foreignKey: { name: "teacher_id", allowNull: false }});
Subject.belongsTo(User, { as: "teacher", foreignKey: { name: "teacher_id", allowNull: false }});

module.exports = Subject;
