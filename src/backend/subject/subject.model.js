const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TestSchema = require("./test.model");

const SubjectSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    class: {
        ref: "Class",
        type: Schema.Types.ObjectId
    },
    teacher: {
        ref: "User",
        required: true,
        type: Schema.Types.ObjectId
    },
    tests: [TestSchema],
    status: {
        type: String,
        enum: ["active", "archived"]
    },
    created_by: {
        ref: "User",
        required: true,
        type: Schema.Types.ObjectId
    },
    updated_by: {
        ref: "User",
        required: true,
        type: Schema.Types.ObjectId
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

module.exports = mongoose.model("Subject", SubjectSchema);
