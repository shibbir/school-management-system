const { string, object } = require("yup");

const subjectSchema = object().shape({
    name: string()
        .min(2, "Subject name must be at least 2 characters long.")
        .max(50, "Subject name must be at most 50 characters long.")
        .required("Subject name must not be empty."),
    teacher_id: string()
        .required("Teacher is required.")
        .uuid("Teacher Id must be a valid UUID")
});

const classIdSchema = object().shape({
    id: string()
        .uuid("Class Id must be a valid UUID")
        .required("Class Id is a required parameter.")
});

const subjectIdSchema = object().shape({
    id: string()
        .uuid("Subject Id must be a valid UUID")
        .required("Subject Id is a required parameter.")
});

exports.subjectSchema = subjectSchema;
exports.classIdSchema = classIdSchema;
exports.subjectIdSchema = subjectIdSchema;
