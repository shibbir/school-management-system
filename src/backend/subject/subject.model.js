const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TestSchema = require("./test.model");

const SubjectSchema = Schema({
    name: {
        type: String,
        unique: true,
        maxlength: 50,
        required: true
    },
    teacher: {
        ref: "User",
        required: true,
        type: Schema.Types.ObjectId
    },
    tests: [TestSchema],
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

module.exports = SubjectSchema;
