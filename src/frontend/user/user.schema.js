import { string, object, ref } from "yup";

export const loginSchema = object().shape({
    email: string()
        .email("This field should be an valid email address.")
        .required("This field must not be empty."),
    password: string()
        .required("This field must not be empty.")
});
