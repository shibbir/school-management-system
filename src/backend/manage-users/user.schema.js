const { string, object, ref } = require("yup");

const loginSchema = object().shape({
    username: string()
        .required("Username is a required field."),
    password: string()
        .required("Password is a required field."),
    grant_type: string()
        .required("Grant type is a required field.")
        .test("is-supported-grant", "The requested grant_type is not supported.", grant_type => ["password", "refresh_token"].includes(grant_type) || !grant_type)
});

const registrationSchema = object().shape({
    username: string()
        .required("Username is a required field.")
        .email("Username must be an valid email address.")
        .max(50, "Username must be at most 50 characters long."),
    password: string()
        .when("id", {
            is: (id) => !id,
            then: string()
                .required("Password is a required field.")
                .min(8, "Password must be at least 8 characters long.")
        }),
    confirm_password: string()
        .when("id", {
            is: (id) => !id,
            then: string()
                .required("Confirm Password is a required field.")
                .min(8, "Password must be at least 8 characters long.")
                .oneOf([ref("password"), null], "Password and confirm password doesn't match.")
        }),
    forename: string()
        .required("Forename is a required field.")
        .max(50, "Forename must be at most 50 characters long."),
    surname: string()
        .required("Surname is a required field.")
        .max(50, "Surname must be at most 50 characters long."),
    role: string()
        .when("id", {
            is: (id) => !id,
            then: string()
                .required("Role is a required field.")
                .test("is-valid-role", "The requested role is not supported.", role => ["admin", "teacher", "pupil"].includes(role) || !role)
        })
});

const idSchema = object().shape({
    id: string()
        .uuid("User Id must be a valid UUID")
        .required("User Id is a required parameter.")
});

const changePasswordSchema = object().shape({
    current_password: string()
        .required("Current password is a required field.")
        .min(8, "Password must be at least 8 characters long."),
    new_password: string()
        .required("New password is a required field.")
        .min(8, "Password must be at least 8 characters long."),
    confirm_new_password: string()
        .required("Confirm new password is a required field.")
        .min(8, "Password must be at least 8 characters long.")
        .oneOf([ref("new_password"), null], "New password and confirm password does not match.")
});

exports.loginSchema = loginSchema;
exports.registrationSchema = registrationSchema;
exports.idSchema = idSchema;
exports.changePasswordSchema = changePasswordSchema;
