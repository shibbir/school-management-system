const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubjectSchema = require("../subject/subject.model");

const ClassSchema = Schema({
    name: {
        type: String,
        unique: true,
        minlength: 2,
        maxlength: 50,
        required: true
    },
    pupils: {
        type: [{
            ref: "User",
            type: Schema.Types.ObjectId
        }]
    },
    subjects: [SubjectSchema],
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

module.exports = mongoose.model("Class", ClassSchema);
