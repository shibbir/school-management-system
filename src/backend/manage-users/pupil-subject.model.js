const { DataTypes } = require("sequelize");

const User = require("./user.model");
const sequelize = require("../config/lib/sequelize");
const Subject = require("../manage-subjects/subject.model");

const PupilSubejct = sequelize.dbConnector.define("pupil_subejct", {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    }
}, {
    schema: process.env.POSTGRES_DATABASE_SCHEMA,
    timestamps: false
});

User.belongsToMany(Subject, { through: PupilSubejct, foreignKey: "subject_id", otherKey: "pupil_id" });
Subject.belongsToMany(User, { through: PupilSubejct, foreignKey: "pupil_id", otherKey: "subject_id" });

module.exports = PupilSubejct;
