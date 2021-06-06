const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    subjects: {
        type: [{
            ref: "Subject",
            type: Schema.Types.ObjectId
        }]
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

module.exports = mongoose.model("Class", ClassSchema);
