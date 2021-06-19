import { string, object, ref } from "yup";

export const loginSchema = object().shape({
    username: string()
        .email("This field should be an valid email address.")
        .required("This field must not be empty."),
    password: string()
        .required("This field must not be empty.")
});

export const createUserSchema = object().shape({
    forename: string()
        .required("This field must not be empty.")
        .max(25, "This field must be at most 25 characters long."),
    surname: string()
        .required("This field must not be empty.")
        .max(25, "This field must be at most 25 characters long."),
    role: string()
        .required("This field must not be empty."),
    username: string()
        .email("This field should be an valid email address.")
        .required("This field must not be empty."),
    password: string()
        .when("id", {
            is: (id) => !id,
            then: string()
                .min(8, "This field must be at least 8 characters long.")
                .max(60, "This field must be at most 60 characters long.")
                .required("This field must not be empty.")
        }),
    confirm_password: string()
        .when("id", {
            is: (id) => !id,
            then: string()
                .min(8, "This field must be at least 8 characters long.")
                .max(60, "This field must be at most 60 characters long.")
                .required("This field must not be empty.")
                .oneOf([ref("password"), null], "Password and confirm password doesn't match.")
            })
});

export const changePasswordSchema = object().shape({
    current_password: string()
        .min(8, "This field must be at least 8 characters long.")
        .max(60, "This field must be at most 60 characters long.")
        .required("This field must not be empty."),
    new_password: string()
        .min(8, "This field must be at least 8 characters long.")
        .max(60, "This field must be at most 60 characters long.")
        .required("This field must not be empty."),
    confirm_new_password: string()
        .min(8, "This field must be at least 8 characters long.")
        .max(60, "This field must be at most 60 characters long.")
        .required("This field must not be empty.")
        .oneOf([ref("new_password"), null], "New password and confirm password does not match.")
});
