const { string, object, number } = require("yup");

const testResultSchema = object().shape({
    pupil_id: string()
        .required("Pupil is required.")
        .uuid("Pupil Id must be a valid UUID"),
    grade: number()
        .typeError("Grade must be a number.")
        .required("Grade is required.")
});

const testResultUpdateSchema = object().shape({
    grade: number()
        .typeError("Grade must be a number.")
        .required("Grade is required.")
});

const testIdSchema = object().shape({
    id: string()
        .uuid("Test Id must be a valid UUID")
        .required("Test Id is a required parameter.")
});

const testResultIdSchema = object().shape({
    id: string()
        .uuid("Test Result Id must be a valid UUID")
        .required("Test Result Id is a required parameter.")
});

exports.testResultSchema = testResultSchema;
exports.testResultUpdateSchema = testResultUpdateSchema;
exports.testIdSchema = testIdSchema;
exports.testResultIdSchema = testResultIdSchema;
