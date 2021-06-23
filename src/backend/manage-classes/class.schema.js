const { string, object } = require("yup");

const classSchema = object().shape({
    name: string()
        .min(2, "Class name must be at least 2 characters long.")
        .max(50, "Class name must be at most 50 characters long.")
        .required("Class name must not be empty.")
});

const idSchema = object().shape({
    id: string()
        .uuid("Class Id must be a valid UUID")
        .required("Class Id is a required parameter.")
});

exports.classSchema = classSchema;
exports.idSchema = idSchema;
