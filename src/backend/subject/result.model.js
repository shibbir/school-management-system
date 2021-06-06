const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = Schema({
    grade: {
        type: Number,
        required: true
    },
    pupil: {
        ref: "User",
        required: true,
        type: Schema.Types.ObjectId
    },
});

module.exports = ResultSchema;
