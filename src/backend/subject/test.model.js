const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ResultSchema = require("./result.model");

const TestSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    results: [ResultSchema],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = TestSchema;
