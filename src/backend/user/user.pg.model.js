const path = require("path");
const bcrypt = require("bcryptjs");
const { DataTypes } = require("sequelize");

const sequelize = require(path.join(process.cwd(), "src/backend/config/lib/sequelize"));

const User = sequelize.dbConnector.define("users", {
    id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    forename: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    surname: {
        allowNull: false,
        type: DataTypes.STRING(50)
    },
    username: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING(50),
        set(value){
            this.setDataValue("username", value.toLowerCase());
        }
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue("password", bcrypt.hashSync(value, 8));
        }
    },
    role: {
        type: DataTypes.ENUM,
        values: ["admin", "teacher", "pupil"]
    },
    program_id: {
        type: DataTypes.UUID,
    },
    refresh_token: {
        type: DataTypes.STRING
    },
    created_by: {
        type: DataTypes.UUID
    },
    updated_by: {
        type: DataTypes.UUID
    },
}, {
    schema: "sms",
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = User;
