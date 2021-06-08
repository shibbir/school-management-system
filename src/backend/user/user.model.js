const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = Schema({
    username: {
        type: String,
        match: [/.+\@.+\..+/],
        unique: true,
        maxlength: 50,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    forename: {
        type: String,
        maxlength: 25,
        required: true
    },
    surname: {
        type: String,
        maxlength: 25,
        required: true
    },
    refresh_token: {
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "teacher", "pupil"]
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
