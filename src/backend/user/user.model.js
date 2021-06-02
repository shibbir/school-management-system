const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const UserSchema = Schema({
    email: {
        type: String,
        match: [/.+\@.+\..+/],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    forename: {
        type: String,
        minlength: 2,
        maxlength: 25,
        required: true
    },
    surname: {
        type: String,
        minlength: 2,
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
    date: {
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
