const { DataTypes } = require("sequelize");

const User = require("./user.model");
const sequelize = require("../config/lib/sequelize");
const Subject = require("../manage-subjects/subject.model");

const PupilSubejct = sequelize.dbConnector.define("pupil_subejcts", {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
}, {
    schema: process.env.POSTGRES_DATABASE_SCHEMA,
    tableName: "pupil_subejcts",
    timestamps: false
});

User.belongsToMany(Subject, { through: PupilSubejct, foreignKey: { name: "pupil_id", allowNull: false }, otherKey: "subject_id" });
Subject.belongsToMany(User, { through: PupilSubejct, foreignKey: { name: "subject_id", allowNull: false }, otherKey: "pupil_id" });

module.exports = PupilSubejct;
