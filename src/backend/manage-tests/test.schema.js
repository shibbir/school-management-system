const { string, object } = require("yup");

const testSchema = object().shape({
    name: string()
        .min(2, "Test name must be at least 2 characters long.")
        .max(50, "Test name must be at most 50 characters long.")
        .required("Test name must not be empty."),
    date: string()
        .required("Date is required.")
});

const testIdSchema = object().shape({
    id: string()
        .uuid("Test Id must be a valid UUID")
        .required("Test Id is a required parameter.")
});

const subjectIdSchema = object().shape({
    id: string()
        .uuid("Subject Id must be a valid UUID")
        .required("Subject Id is a required parameter.")
});

exports.testSchema = testSchema;
exports.testIdSchema = testIdSchema;
exports.subjectIdSchema = subjectIdSchema;
